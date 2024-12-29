import { genAI } from "@/lib/gemini";

export async function POST(request: Request){

    try {

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, similar to Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, and instead focus on universal themes that encourage friendly interaction. The output should be structured as follows: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy? 'Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;

    } catch (error) {
        console.log("Error occured while suggesting messages", error)
        return Response.json(
            {
                success: false,
                message: "Error occured while suggesting messages"
            },
            { status: 500 }
        )
    }

}