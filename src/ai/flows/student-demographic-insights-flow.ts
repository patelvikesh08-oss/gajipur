'use server';
/**
 * @fileOverview An AI agent that analyzes student demographic data to provide insights and recommendations for school administrators.
 *
 * - studentDemographicInsights - A function that analyzes student distribution patterns and suggests optimal resource allocation or classroom balance.
 * - StudentDemographicInsightsInput - The input type for the studentDemographicInsights function.
 * - StudentDemographicInsightsOutput - The return type for the studentDemographicInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentDemographicInsightsInputSchema = z.object({
  students: z.array(
    z.object({
      id: z.string().describe('Unique student identifier.'),
      age: z.number().int().positive().describe('Age of the student in years.'),
      gender: z.enum(['Male', 'Female', 'Other']).describe('Gender of the student.'),
      academicStandard: z.string().describe('Academic standard (grade level) of the student.'),
    })
  ).describe('An array of student demographic records.'),
  context: z.string().optional().describe('Any additional context or specific concerns for the analysis.'),
});
export type StudentDemographicInsightsInput = z.infer<typeof StudentDemographicInsightsInputSchema>;

const InsightRecommendationSchema = z.object({
  category: z.string().describe('The category of the insight, e.g., "Resource Allocation", "Classroom Balance", "Age Distribution".'),
  description: z.string().describe('Detailed description of the insight or observation.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations based on the insight.'),
});

const StudentDemographicInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the overall student demographic distribution patterns observed.'),
  insights: z.array(InsightRecommendationSchema).describe('A list of detailed insights with recommendations for optimizing resource allocation and balancing classrooms.'),
});
export type StudentDemographicInsightsOutput = z.infer<typeof StudentDemographicInsightsOutputSchema>;

const studentDemographicInsightsPrompt = ai.definePrompt({
  name: 'studentDemographicInsightsPrompt',
  input: { schema: StudentDemographicInsightsInputSchema },
  output: { schema: StudentDemographicInsightsOutputSchema },
  prompt: `You are an AI assistant specialized in school administration and demographic analysis. Your task is to analyze the provided student demographic data and offer actionable insights and recommendations for optimizing resource allocation and balancing classrooms across different academic standards, ages, and genders.\n\nHere is the student data:\n{{#each students}}\n- ID: {{this.id}}, Age: {{this.age}}, Gender: {{this.gender}}, Standard: {{this.academicStandard}}\n{{/each}}\n\n{{#if context}}\nAdditional context/concerns from the administrator: {{{context}}}\n{{/if}}\n\nPlease provide:\n1.  A general summary of the student demographic distribution patterns observed.\n2.  A list of specific insights and actionable recommendations, categorized for clarity. Each insight should include a description and a list of concrete recommendations.`,
});

const studentDemographicInsightsFlow = ai.defineFlow(
  {
    name: 'studentDemographicInsightsFlow',
    inputSchema: StudentDemographicInsightsInputSchema,
    outputSchema: StudentDemographicInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await studentDemographicInsightsPrompt(input);
    return output!;
  }
);

export async function studentDemographicInsights(
  input: StudentDemographicInsightsInput
): Promise<StudentDemographicInsightsOutput> {
  return studentDemographicInsightsFlow(input);
}
