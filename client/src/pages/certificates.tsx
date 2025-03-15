import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Award, Check, Copy, ExternalLink, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import PageHeader from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Certificate type
interface Certificate {
  id: number;
  title: string;
  description: string;
  userId: number;
  moduleId: number | null;
  imageUrl: string | null;
  issueDate: string;
  expiryDate: string | null;
  verificationCode: string;
}

// Verified certificate with additional info
interface VerifiedCertificate extends Certificate {
  user: {
    id: number;
    username: string;
    userLevel: string;
  } | null;
  module: {
    id: number;
    title: string;
    difficulty: string;
  } | null;
}

export default function CertificatesPage() {
  const [match, params] = useRoute("/certificates/:verificationCode");
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifiedCertificate, setVerifiedCertificate] = useState<VerifiedCertificate | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Check if we're on the verification route
  useEffect(() => {
    if (match && params?.verificationCode) {
      setVerificationCode(params.verificationCode);
      handleVerifyCertificate(params.verificationCode);
    }
  }, [match, params]);

  // Fetch user's certificates if authenticated
  useEffect(() => {
    const fetchCertificates = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiRequest<{ certificates: Certificate[] }>({
          url: "/api/certificates"
        });

        setCertificates(response.certificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        toast({
          title: "Error",
          description: "Failed to load certificates. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [isAuthenticated, toast]);

  const handleVerifyCertificate = async (code = verificationCode) => {
    if (!code) return;

    try {
      setVerifyLoading(true);
      setVerifyError(null);
      
      const response = await apiRequest<{ 
        verified: boolean;
        certificate?: VerifiedCertificate;
        message?: string;
      }>({
        url: `/api/certificates/verify/${code}`
      });

      if (response.verified && response.certificate) {
        setVerifiedCertificate(response.certificate);
      } else {
        setVerifyError(response.message || "Certificate could not be verified");
        setVerifiedCertificate(null);
      }
    } catch (error) {
      console.error("Error verifying certificate:", error);
      setVerifyError("Failed to verify certificate. Please check the code and try again.");
      setVerifiedCertificate(null);
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyVerificationLink = (code: string) => {
    const link = `${window.location.origin}/certificates/${code}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Certificate verification link has been copied to clipboard",
          variant: "default"
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({
          title: "Failed to copy",
          description: "Please try again or copy the link manually",
          variant: "destructive"
        });
      });
  };

  const formatCertificateDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <PageHeader 
        title="Certificates" 
        description="Verify and manage your financial education certificates"
        icon={<Award className="h-6 w-6" />}
      />

      <Tabs defaultValue={match ? "verify" : "mycertificates"} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="mycertificates">My Certificates</TabsTrigger>
          <TabsTrigger value="verify">Verify Certificate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mycertificates" className="space-y-4">
          {!isAuthenticated ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Award className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Sign in to view your certificates</h3>
                <p className="text-muted-foreground mt-1 mb-4 text-center max-w-md">
                  Your achievements and certificates will be displayed here after you sign in
                </p>
                <Button
                  onClick={() => setLocation("/login")}
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          ) : loading ? (
            Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[200px] w-full" />
            ))
          ) : certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <Card key={cert.id} className="overflow-hidden">
                  {cert.imageUrl ? (
                    <div className="relative h-40 w-full bg-muted">
                      <img 
                        src={cert.imageUrl} 
                        alt={cert.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Award className="h-16 w-16 text-primary/50" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{cert.title}</CardTitle>
                    <CardDescription>
                      Issued on {formatCertificateDate(cert.issueDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{cert.description}</p>
                    {cert.moduleId && (
                      <Badge variant="outline" className="mt-2">
                        Module Completion
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 bg-muted/20 flex justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Certificate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{cert.title}</DialogTitle>
                          <DialogDescription>
                            Issued on {formatCertificateDate(cert.issueDate)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {cert.imageUrl ? (
                            <div className="w-full rounded-md overflow-hidden border">
                              <img 
                                src={cert.imageUrl} 
                                alt={cert.title} 
                                className="w-full h-auto" 
                              />
                            </div>
                          ) : (
                            <div className="w-full h-[200px] rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <Award className="h-20 w-20 text-primary/50" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium mb-1">Certificate Details</h4>
                            <p className="text-sm">{cert.description}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Verification Code</h4>
                            <div className="flex items-center">
                              <code className="text-sm bg-muted px-2 py-1 rounded flex-1 font-mono">
                                {cert.verificationCode}
                              </code>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => copyVerificationLink(cert.verificationCode)}
                                className="ml-2"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => copyVerificationLink(cert.verificationCode)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Verification Link
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyVerificationLink(cert.verificationCode)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Award className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No certificates yet</h3>
                <p className="text-muted-foreground mt-1 mb-4 text-center max-w-md">
                  Complete learning modules and challenges to earn certificates
                </p>
                <Button
                  onClick={() => setLocation("/learning-modules")}
                >
                  Explore Learning Modules
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verify Certificate</CardTitle>
              <CardDescription>
                Enter a certificate verification code to verify its authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="font-mono"
                />
                <Button 
                  onClick={() => handleVerifyCertificate()}
                  disabled={verifyLoading || !verificationCode}
                >
                  {verifyLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
              
              {verifyError && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                  {verifyError}
                </div>
              )}
            </CardContent>
          </Card>

          {verifiedCertificate && (
            <Card className="border-green-500">
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-green-500 mr-2" />
                  <CardTitle>Certificate Verified</CardTitle>
                </div>
                <CardDescription>
                  This certificate is authentic and was issued by our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{verifiedCertificate.title}</h3>
                      <p className="text-muted-foreground">{verifiedCertificate.description}</p>
                    </div>
                    {verifiedCertificate.imageUrl && (
                      <div className="h-20 w-20">
                        <img 
                          src={verifiedCertificate.imageUrl} 
                          alt="Certificate" 
                          className="h-full w-full object-contain" 
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Recipient</h4>
                      <p>{verifiedCertificate.user?.username || 'Anonymous'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Issue Date</h4>
                      <p>{formatCertificateDate(verifiedCertificate.issueDate)}</p>
                    </div>
                    {verifiedCertificate.module && (
                      <>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Module</h4>
                          <p>{verifiedCertificate.module.title}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Difficulty</h4>
                          <p className="capitalize">{verifiedCertificate.module.difficulty}</p>
                        </div>
                      </>
                    )}
                    {verifiedCertificate.user && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">User Level</h4>
                        <p>{verifiedCertificate.user.userLevel}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}