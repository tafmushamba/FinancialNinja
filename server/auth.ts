import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { User } from "../shared/schema";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import { z } from "zod";
import { log } from "./vite";
import bcrypt from "bcryptjs";

// Define a MemoryStore for sessions (note: in production, you'd use a real database)
import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

export function setupAuth(app: express.Express) {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "finwiz-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        // Compare provided password with stored hash
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to the session
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register authentication routes
  registerAuthRoutes(app);

  return {
    isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(401).json({ message: "Unauthorized" });
    }
  };
}

// Schema for user registration
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
});

// Schema for user login
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function registerAuthRoutes(app: express.Express) {
  // User registration endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }

      const { username, password, firstName, lastName, email } = validationResult.data;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email
      });

      // Log in the user automatically
      req.login(user, (err) => {
        if (err) {
          log("Error during login after registration: " + err.message);
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        
        // Return user info (excluding password)
        const { password, ...userInfo } = user;
        return res.status(201).json({ 
          message: "Registration successful",
          user: userInfo
        });
      });
    } catch (error) {
      log("Registration error: " + error);
      res.status(500).json({ message: "Internal server error during registration" });
    }
  });

  // User login endpoint
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }

      passport.authenticate("local", (err: any, user: User, info: any) => {
        if (err) {
          return next(err);
        }
        
        if (!user) {
          return res.status(401).json({ message: info.message || "Authentication failed" });
        }
        
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          
          // Return user info (excluding password)
          const { password, ...userInfo } = user;
          return res.json({ 
            message: "Login successful",
            user: userInfo
          });
        });
      })(req, res, next);
    } catch (error) {
      log("Login error: " + error);
      res.status(500).json({ message: "Internal server error during login" });
    }
  });

  // User logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        log("Logout error: " + err);
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user info
  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as User;
    const { password, ...userInfo } = user;
    
    res.json({ user: userInfo });
  });
}