import express, { type Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import bcrypt from "bcryptjs";
import { User } from "../shared/schema";

export function setupAuth(app: express.Express) {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "financial-literacy-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Successful login
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Configure Google Strategy
  const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const googleCallbackURL = process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com/api/auth/google/callback"
    : "http://localhost:3000/api/auth/google/callback";

  console.log("--- Google OAuth Configuration ---");
  console.log("Client ID:", googleClientId ? "Loaded" : "MISSING!");
  // Avoid logging the actual secret
  console.log("Client Secret:", googleClientSecret ? "Loaded" : "MISSING!"); 
  console.log("Callback URL:", googleCallbackURL);
  console.log("----------------------------------");

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists by Google ID
          let user = await storage.getUserByGoogleId(profile.id);
          
          if (!user) {
            // Check if user exists with the same email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            if (email) {
              user = await storage.getUserByEmail(email);
            }
            
            if (user) {
              // Update existing user with Google ID
              user = await storage.updateUserGoogleId(user.id, profile.id);
            } else {
              // Create new user from Google profile
              const firstName = profile.name?.givenName || profile.displayName.split(' ')[0];
              const lastName = profile.name?.familyName || '';
              
              // Use Google display name as username
              const username = profile.displayName || (email ? email.split('@')[0] : `user_${Math.floor(Math.random() * 10000)}`);
              
              // Get profile picture if available
              const profilePicture = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
              
              user = await storage.createUser({
                username: username,
                email: email || null,
                firstName: firstName || null,
                lastName: lastName || null,
                googleId: profile.id,
                profilePicture: profilePicture,
                // No password for Google auth users
                password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10)
              });
            }
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // Serialize user information to store in session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
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

  // Middleware for checking if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // In development mode, skip authentication to allow testing with mock data
    if (process.env.NODE_ENV !== "production" || req.isAuthenticated()) {
      // If in development mode and not authenticated, add mock user data
      if (process.env.NODE_ENV !== "production" && !req.isAuthenticated()) {
        // Add mock user to request - Using actual user from storage for data consistency
        const mockUser = {
          id: 1, // This should match existing user data in storage for proper queries
          username: "johnsmith",
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@example.com",
          userLevel: "Level 3 Investor",
          financialLiteracyScore: 72,
        };
        
        (req as any).user = mockUser;
      }
      return next();
    }
    
    res.status(401).json({ message: "Not authenticated" });
  };

  return { isAuthenticated };
}

function registerAuthRoutes(app: express.Express) {
  // Google Auth routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Successful authentication, redirect to dashboard
      res.redirect("/dashboard");
    }
  );

  // Registration route
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, password, firstName, lastName, email } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
      });
      
      // Log in the user after registration
      req.login(newUser, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        
        // Return user info (without password)
        const { password, ...userWithoutPassword } = newUser;
        return res.status(201).json({ 
          message: "User registered successfully",
          user: userWithoutPassword 
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login route
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: User, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ message: "Error creating session" });
        }
        
        // Return user info (without password)
        const { password, ...userWithoutPassword } = user;
        return res.json({ 
          message: "Login successful",
          user: userWithoutPassword 
        });
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Error during logout" });
      }
      
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user route
  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as User;
    // Return user info (without password)
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  });
}