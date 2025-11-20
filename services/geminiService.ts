import { GoogleGenAI, Type } from "@google/genai";
import type { BrandProfile } from "../types";

// Lazy initialization for the AI instance
let ai: GoogleGenAI | null = null;
const getAi = () => {
    if (!ai) {
        const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
        ai = new GoogleGenAI({ apiKey: apiKey as string });
    }
    return ai;
}

const getBrandProfilePrompt = (brandProfile?: BrandProfile | null): string => {
    if (!brandProfile || !brandProfile.companyDescription) return "Act as a world-class social media strategist.";
    return `
        Act as a world-class social media strategist for a specific brand.
        **Brand Context:**
        - **Company Description:** ${brandProfile.companyDescription}
        - **Target Audience:** ${brandProfile.targetAudience}
        - **Brand Voice:** ${brandProfile.brandVoice.join(', ')}
        - **Key Information:** ${brandProfile.knowledgeBase}
        
        Use this brand context to inform all your outputs, ensuring they are perfectly aligned with the brand's identity and goals.
    `;
};


export const generateContentIdeas = async (topic: string, platform: string, tone: string, brandProfile?: BrandProfile | null): Promise<string> => {
    const brandPrompt = getBrandProfilePrompt(brandProfile);
    const prompt = `
        ${brandPrompt}
        Generate 3 distinct and engaging content ideas for a ${platform} post about "${topic}".
        The tone of the content should be ${tone}.
        For each idea, provide a compelling headline, a body of text, and 3-5 relevant hashtags.
        Format the output as a JSON object.
    `;

    try {
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ideas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    content: { type: Type.STRING },
                                    hashtags: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content ideas:", error);
        throw new Error('AI failed to generate ideas. Please try again.');
    }
};

export const generateCommentReply = async (postContent: string, comment: string, brandProfile?: BrandProfile | null): Promise<string> => {
    const brandPrompt = getBrandProfilePrompt(brandProfile).replace('social media strategist', 'helpful social media manager');
    const prompt = `
      ${brandPrompt}
      My recent post was about: "${postContent}".
      A user left this comment: "${comment}".
      Generate 3 distinct, positive, and engaging reply options to this comment. Keep them concise and aligned with my brand voice.
      Format the output as a JSON object with a key "replies" which is an array of strings.
    `;

    try {
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        replies: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating comment reply:", error);
        throw new Error("AI couldn't generate a reply right now.");
    }
};


export const generatePerformanceInsights = async (analyticsData: object, brandProfile?: BrandProfile | null): Promise<string> => {
    const brandPrompt = getBrandProfilePrompt(brandProfile);
    const prompt = `
        ${brandPrompt}
        I am providing you with my social media analytics data in JSON format.
        Analyze this data and provide a concise, natural language summary of my performance.
        Explain the "why" behind the numbers. What's working and what isn't?
        Conclude with 3 concrete, actionable recommendations for my content strategy based on this data.
        
        Analytics Data:
        ${JSON.stringify(analyticsData, null, 2)}
    `;

    try {
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating performance insights:", error);
        throw new Error("Could not generate insights at this time.");
    }
};

export const generateStrategicPlan = async (brandProfile: BrandProfile, performanceData: object): Promise<string> => {
    const brandPrompt = getBrandProfilePrompt(brandProfile);
    const prompt = `
        ${brandPrompt}
        Your task is to create a proactive, 7-day social media content plan.
        Analyze my past performance data to understand what resonates with my audience.
        Generate a plan with one unique post suggestion for each day of the week, from Monday to Sunday.
        For each suggestion, provide: the day, a recommended time, the platform, a specific topic, the ideal format (e.g., Text-only, Poll, Image with Caption, Carousel), and a brief reasoning for your suggestion.
        
        Past Performance Data:
        ${JSON.stringify(performanceData, null, 2)}

        Format the output as a JSON object with a single key "plan" which is an array of 7 objects.
    `;

    try {
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for strategic tasks
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        plan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING },
                                    time: { type: Type.STRING },
                                    platform: { type: Type.STRING },
                                    topic: { type: Type.STRING },
                                    format: { type: Type.STRING },
                                    reasoning: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating strategic plan:", error);
        throw new Error("Failed to generate strategic plan.");
    }
};


export const multiplyContent = async (longFormContent: string, brandProfile: BrandProfile): Promise<string> => {
    const brandPrompt = getBrandProfilePrompt(brandProfile);
    const prompt = `
        ${brandPrompt}
        Your task is to act as a Content Multiplier. I will provide you with a piece of long-form content.
        Repurpose this content into a complete, multi-platform social media campaign.
        
        Generate the following assets:
        1.  A professional, insightful LinkedIn article (3-4 paragraphs).
        2.  A punchy, engaging Twitter thread (3-5 tweets), with each tweet clearly numbered.
        3.  A visually broken-down Instagram carousel script (text for 4-6 slides).
        
        Original Content:
        ---
        ${longFormContent}
        ---

        Format the output as a single JSON object.
    `;
    
    try {
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        linkedInArticle: { type: Type.STRING },
                        twitterThread: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { tweet: { type: Type.STRING } }
                            }
                        },
                        instagramCarousel: {
                             type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    slide: { type: Type.NUMBER },
                                    content: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error multiplying content:", error);
        throw new Error("Failed to multiply content.");
    }
};