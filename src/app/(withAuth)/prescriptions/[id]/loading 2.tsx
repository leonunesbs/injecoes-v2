import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Skeleton } from "~/components/ui/skeleton";

export default function PatientLoading() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Main Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="mb-1 h-4 w-16" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div>
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div>
                <Skeleton className="mb-1 h-4 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Skeleton className="mx-auto mb-2 h-8 w-12" />
                <Skeleton className="mx-auto h-3 w-20" />
              </div>
              <div className="text-center">
                <Skeleton className="mx-auto mb-2 h-8 w-12" />
                <Skeleton className="mx-auto h-3 w-20" />
              </div>
            </div>
            <div className="my-4">
              <Skeleton className="h-px w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="mb-1 h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="text-right">
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Injections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-36" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="text-right">
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
