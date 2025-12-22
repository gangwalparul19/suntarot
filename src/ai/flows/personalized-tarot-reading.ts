'use server';
/**
 * @fileOverview A personalized tarot reading AI agent.
 *
 * - personalizedTarotReading - A function that handles the tarot reading process.
 * - PersonalizedTarotReadingInput - The input type for the personalizedTarotReading function.
 * - PersonalizedTarotReadingOutput - The return type for the personalizedTarotReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTarotReadingInputSchema = z.object({
  cardSelections: z
    .array(z.string())
    .describe('An array of selected tarot card names.'),
  userContext: z
    .string()
    .describe(
      'A description of the user and their current situation or question.'
    ),
  style: z
    .enum(['empathetic', 'direct', 'mystical', 'practical'])
    .optional()
    .describe('The style or tone of the reading.')
});
export type PersonalizedTarotReadingInput =
  z.infer<typeof PersonalizedTarotReadingInputSchema>;

const PersonalizedTarotReadingOutputSchema = z.object({
  reading: z.string().describe('A personalized tarot card reading.'),
});
export type PersonalizedTarotReadingOutput =
  z.infer<typeof PersonalizedTarotReadingOutputSchema>;

export async function personalizedTarotReading(
  input: PersonalizedTarotReadingInput
): Promise<PersonalizedTarotReadingOutput> {
  return personalizedTarotReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedTarotReadingPrompt',
  input: {schema: PersonalizedTarotReadingInputSchema},
  output: {schema: PersonalizedTarotReadingOutputSchema},
  prompt: `You are an expert tarot card reader. You will provide a personalized tarot card reading based on the user\'s card selections and their context.
  
  Reading Style: {{style}} (If not specified, default to 'empathetic').
  
  The reading should be insightful and provide guidance based on the symbolism of the cards and the user's specific situation, strictly adhering to the requested style:
  - Empathetic: Warm, comforting, focusing on emotional support.
  - Direct: Straightforward, no-nonsense, focusing on actionable advice.
  - Mystical: Esoteric, poetic, focusing on spiritual growth and cosmic patterns.
  - Practical: Grounded, realistic, focusing on day-to-day application.

User Context: {{{userContext}}}
Selected Cards: {{#each cardSelections}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}`,
});

const personalizedTarotReadingFlow = ai.defineFlow(
  {
    name: 'personalizedTarotReadingFlow',
    inputSchema: PersonalizedTarotReadingInputSchema,
    outputSchema: PersonalizedTarotReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
