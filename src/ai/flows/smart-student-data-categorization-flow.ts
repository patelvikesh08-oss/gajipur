'use server';
/**
 * @fileOverview A Genkit flow for intelligent data entry, categorizing student age and academic standard from raw text.
 *
 * - categorizeStudentData - A function that processes raw text to extract and categorize student data.
 * - CategorizeStudentDataInput - The input type for the categorizeStudentData function.
 * - CategorizeStudentDataOutput - The return type for the categorizeStudentData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeStudentDataInputSchema = z.object({
  textData: z
    .string()
    .describe('Raw text or CSV data containing student information from which age and academic standard should be extracted.')
});
export type CategorizeStudentDataInput = z.infer<typeof CategorizeStudentDataInputSchema>;

const CategorizeStudentDataOutputSchema = z.object({
  students: z.array(
    z.object({
      name: z.string().optional().describe('The extracted name of the student, if available.'),
      age: z.number().describe('The extracted age of the student.'),
      academicStandard: z.string().describe('The extracted academic standard/grade level of the student (e.g., "1st Grade", "Sophomore", "Year 7").')
    })
  ).describe('An array of categorized student records.')
});
export type CategorizeStudentDataOutput = z.infer<typeof CategorizeStudentDataOutputSchema>;

export async function categorizeStudentData(
  input: CategorizeStudentDataInput
): Promise<CategorizeStudentDataOutput> {
  return categorizeStudentDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeStudentDataPrompt',
  input: { schema: CategorizeStudentDataInputSchema },
  output: { schema: CategorizeStudentDataOutputSchema },
  prompt: `You are an AI assistant designed to extract and categorize student information from unstructured text or CSV data.
Your task is to identify student records within the provided 'textData', specifically extracting their age and academic standard (grade level).
If a student's name is explicitly mentioned and can be clearly associated with their age and standard, include it.
If multiple students are mentioned, extract information for all of them.

Here is the raw data:
{{{textData}}}

Please provide the extracted information in a JSON array format as described by the output schema, containing 'name' (if available), 'age', and 'academicStandard' for each student.`
});

const categorizeStudentDataFlow = ai.defineFlow(
  {
    name: 'categorizeStudentDataFlow',
    inputSchema: CategorizeStudentDataInputSchema,
    outputSchema: CategorizeStudentDataOutputSchema
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
