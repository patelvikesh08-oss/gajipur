
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { studentDemographicInsights, StudentDemographicInsightsOutput } from "@/ai/flows/student-demographic-insights-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function InsightsPage() {
  const { students, isLoaded } = useStudentStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudentDemographicInsightsOutput | null>(null);

  const generateInsights = async () => {
    if (!students.length) return;
    setLoading(true);
    try {
      const data = await studentDemographicInsights({
        students: students.map(s => ({
          id: s.id,
          age: s.age,
          gender: s.gender as 'Male' | 'Female' | 'Other',
          academicStandard: s.academicStandard
        })),
        context: "Analyze classroom balancing and identify standards with demographic skew."
      });
      setResult(data);
    } catch (error) {
      console.error("AI Insights Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-primary text-white">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-headline font-bold text-foreground">Demographic Insight Engine</h1>
            <p className="text-muted-foreground font-medium max-w-lg">
              Analyze your current student population to uncover hidden patterns and receive data-driven recommendations for classroom balancing and resource allocation.
            </p>
          </div>
          <Button size="lg" onClick={generateInsights} disabled={loading || !students.length} className="font-headline font-bold px-8 shadow-lg shadow-primary/20">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        </div>

        {loading && (
          <div className="space-y-4">
            <Progress value={45} className="h-2" />
            <p className="text-center text-sm text-muted-foreground animate-pulse font-medium">AI is processing student demographic matrix...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-primary/20 overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="font-headline text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed text-foreground/80 font-medium italic">
                  &quot;{result.summary}&quot;
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
              {result.insights.map((insight, idx) => (
                <Card key={idx} className="transition-all hover:border-primary/40 group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                        {insight.category}
                      </div>
                    </div>
                    <CardTitle className="font-headline">{insight.description}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-accent" />
                        Recommendations
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {insight.recommendations.map((rec, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Ready to analyze {students.length} student records.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
