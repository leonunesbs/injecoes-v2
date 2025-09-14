import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function Loading() {
  return (
    <>
      <div className="space-y-2">
        <div className="bg-muted h-8 w-56 animate-pulse rounded"></div>
        <div className="bg-muted h-4 w-96 animate-pulse rounded"></div>
      </div>

      <Card>
        <CardHeader>
          <div className="bg-muted h-6 w-64 animate-pulse rounded"></div>
          <div className="bg-muted h-4 w-80 animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted h-4 w-32 animate-pulse rounded"></div>
            <div className="bg-muted h-10 w-full animate-pulse rounded"></div>
            <div className="bg-muted h-4 w-40 animate-pulse rounded"></div>
            <div className="bg-muted h-10 w-full animate-pulse rounded"></div>
            <div className="bg-muted h-4 w-36 animate-pulse rounded"></div>
            <div className="bg-muted h-10 w-full animate-pulse rounded"></div>
            <div className="bg-muted h-10 w-32 animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
