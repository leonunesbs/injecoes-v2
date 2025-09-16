import { CheckCircle, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function VerifyRequestPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent you a magic link to sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">What&apos;s next?</p>
                  <p className="text-muted-foreground text-sm">
                    1. Check your email inbox (and spam folder)
                  </p>
                  <p className="text-muted-foreground text-sm">
                    2. Click the magic link in the email
                  </p>
                  <p className="text-muted-foreground text-sm">
                    3. You&apos;ll be automatically signed in
                  </p>
                </div>
              </div>
            </div>

            <div className="text-muted-foreground text-center text-sm">
              <p>The magic link will expire in 24 hours.</p>
              <p>
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
