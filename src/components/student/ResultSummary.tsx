import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ResultSummary = () => {
  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Result Summary</h1>
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};
export default ResultSummary;
