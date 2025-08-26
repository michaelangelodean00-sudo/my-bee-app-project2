import { Shield, Copyright, FileText, AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEOHead from "@/components/SEOHead";

const CopyrightPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <SEOHead
        title="Copyright Policy - B.E.E App Bahamas"
        description="Copyright policy and intellectual property rights for B.E.E App Bahamas. Learn about our content protection and DMCA compliance."
        keywords="copyright, intellectual property, DMCA, legal, protection, B.E.E App"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Copyright size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Copyright Policy</h1>
          <p className="text-lg text-muted-foreground">
            Protecting intellectual property rights and content ownership
          </p>
        </div>

        {/* Copyright Notice Alert */}
        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary-foreground/80">
            <strong>© {currentYear} B.E.E App Bahamas. All rights reserved.</strong> 
            This application and all its contents are protected by copyright law and international treaties.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Ownership and Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                Ownership and Copyright
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Protected Content Includes:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>B.E.E App name, logo, and branding elements</li>
                  <li>Application source code and architecture</li>
                  <li>User interface designs and layouts</li>
                  <li>Original graphics, images, and visual content</li>
                  <li>Text content, descriptions, and marketing materials</li>
                  <li>Database structure and content organization</li>
                  <li>Proprietary algorithms and functionality</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Copyright Registration:</h4>
                <p className="text-sm text-muted-foreground">
                  B.E.E App Bahamas is in the process of formal copyright registration with relevant authorities. 
                  All content is protected from the moment of creation under international copyright law.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Usage Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-green-600" size={20} />
                Permitted Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold">You may:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Use the application for personal and business purposes as intended</li>
                  <li>Share links to the application and its content</li>
                  <li>Create posts and content within the platform guidelines</li>
                  <li>Take screenshots for legitimate business or educational purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-destructive" size={20} />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold">Strictly Prohibited:</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Copying, reproducing, or distributing the application code</li>
                  <li>Using B.E.E App branding, logos, or design elements</li>
                  <li>Reverse engineering or attempting to extract source code</li>
                  <li>Creating derivative works or competing applications</li>
                  <li>Scraping or automated data collection</li>
                  <li>Selling, licensing, or sublicensing any part of the application</li>
                  <li>Removing or altering copyright notices</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* DMCA Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>DMCA Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA).
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">To report copyright infringement:</h4>
                <ol className="list-decimal pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Identify the copyrighted work being infringed</li>
                  <li>Identify the specific content that is allegedly infringing</li>
                  <li>Provide your contact information</li>
                  <li>Include a statement of good faith belief</li>
                  <li>Include a statement of accuracy under penalty of perjury</li>
                  <li>Provide your electronic or physical signature</li>
                </ol>
              </div>

              <Button className="w-full sm:w-auto" variant="outline">
                <Mail size={16} className="mr-2" />
                Report Copyright Infringement
              </Button>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Trademark Status:</h4>
                  <p className="text-sm text-muted-foreground">
                    B.E.E App™ is a trademark of B.E.E App Bahamas, registered and protected under applicable trademark laws.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">International Protection:</h4>
                  <p className="text-sm text-muted-foreground">
                    Our intellectual property is protected under international copyright treaties and conventions.
                  </p>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Violation of these copyright terms may result in legal action, including monetary damages and injunctive relief. 
                  We actively monitor and protect our intellectual property rights.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact for Copyright Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  For copyright inquiries, licensing requests, or legal matters:
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Copyright Agent:</h4>
                  <p className="text-sm">B.E.E App Bahamas Legal Department</p>
                  <p className="text-sm text-muted-foreground">Nassau, The Bahamas</p>
                  <p className="text-sm text-muted-foreground">Email: legal@beeapp.bs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Last updated: January {currentYear} | © {currentYear} B.E.E App Bahamas - All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyrightPage;