"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ResultSummary = () => {
  return (
    <Card className="bg-transparent dark:border-primary/40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Result Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Result Summary</p>
      </CardContent>
    </Card>
  );
};
export default ResultSummary;
