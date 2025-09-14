import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <div className="bg-muted h-6 w-48 animate-pulse rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Carregando prescrições...</div>
        </div>
      </CardContent>
    </Card>
  );
}
