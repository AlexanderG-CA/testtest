//TOOD: Remove before production
// This is just a placeholder page for the shop section
// You can replace this with your actual shop implementation later
async function getData() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {};
}

export default async function AboutPage() {
    //TODO: Fetch real data here
    await getData();

    return (
        <main className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-500">
                Page in development 🚧
            </h1>
        </main>
    )
}