import { genAI } from "@/lib/gemini";

export async function GET(request: Request){

    try {

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const getRandomTopic = () => {
            const topics = ['hobbies', 'travel', 'food', 'movies', 'books', 'music', 'dreams', 'childhood', 'future', 
                'nature', 'technology', 'creativity', 'learning'];
            return topics[Math.floor(Math.random() * topics.length)];
        };
        
        const prompt = `Create 3 engaging questions for an anonymous social platform about ${getRandomTopic()}, 
        ${getRandomTopic()}, and ${getRandomTopic()}. Each question should be completely different from each other. Word Range 5-15 words.
        Separate them with '||'.
        Current timestamp: ${Date.now()}
        Random factors: ${Math.random()}, ${Math.random()}, ${Math.random()}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return Response.json(
            {
                success: true,
                message: text
            },
            { status: 200 }
        )

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