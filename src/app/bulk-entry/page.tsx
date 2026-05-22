
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore, Gender } from "@/lib/student-store";
import { categorizeStudentData, CategorizeStudentDataOutput } from "@/ai/flows/smart-student-data-categorization-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileInput, Loader2, Sparkles, Check, X, AlertTriangle, ListPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

export default function BulkEntryPage() {
  const { bulkAddStudents } = useStudentStore();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CategorizeStudentDataOutput | null>(null);

  const processBulkData = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const result = await categorizeStudentData({ textData: text });
      setPreview(result);
    } catch (error) {
      console.error("Bulk process error:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmImport = () => {
    if (!preview) return;
    const toAdd = preview.students.map(s => ({
      name: s.name || "Unknown Student",
      age: s.age,
      gender: "Male" as Gender, // Default as AI doesn't always extract gender reliably in basic prompt
      academicStandard: s.academicStandard
    }));
    bulkAddStudents(toAdd);
    toast({
      title: "Import Successful",
      description: `Added ${toAdd.length} students to the database.`,
    });
    setPreview(null);
    setText("");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-foreground">Intelligent Bulk Entry</h1>
          <p className="text-muted-foreground font-medium">
            Paste raw text, list of names with ages, or academic details. Our AI will automatically structure the records.
          </p>
        </div>

        {!preview ? (
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <FileInput className="w-5 h-5 text-primary" />
                Raw Data Input
              </CardTitle>
              <CardDescription className="font-medium">
                Example: &quot;John is 10 in 5th Grade, Alice Johnson age 12 7th standard...&quot;
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste your unstructured student data here..." 
                className="min-h-[250px] font-mono text-sm p-4 bg-muted/30 focus-visible:ring-primary"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={processBulkData} 
                  disabled={loading || !text.trim()} 
                  className="font-headline font-bold px-8 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Structuring Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Process with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Structured Preview ({preview.students.length} Records)
              </h2>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setPreview(null)} className="font-bold">
                  <X className="w-4 h-4 mr-2" />
                  Discard
                </Button>
                <Button onClick={confirmImport} className="font-headline font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20">
                  <ListPlus className="w-4 h-4 mr-2" />
                  Commit Import
                </Button>
              </div>
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 font-bold">Review Required</AlertTitle>
              <AlertDescription className="text-amber-700 font-medium">
                Please verify the extracted data below. Gender defaults to &apos;Male&apos; and should be updated individually in the Student Manager after import.
              </AlertDescription>
            </Alert>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-xs uppercase tracking-widest">Name</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-widest">Age</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-widest">Standard</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.students.map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold text-foreground">{s.name || "N/A"}</TableCell>
                      <TableCell>{s.age} Yrs</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">{s.academicStandard}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
