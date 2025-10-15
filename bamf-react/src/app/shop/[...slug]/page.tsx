import React from "react";

type Props = { params: { slug?: string[] } };

const getData = async (slug: string) => {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { slug };
};


export default async function Page({ params }: Props) {
    const segments = params?.slug ?? [];
    const joined = segments.join("/");
    await getData(joined);

    return (
        <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
            <h1>Simple slug</h1>

            {segments.length > 0 ? (
                <>
                    <p>Segments:</p>
                    <ul>
                        {segments.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>

                    <p>
                        Joined: <strong>{joined}</strong>
                    </p>
                </>
            ) : (
                <p>No slug provided.</p>
            )}
        </main>
    );
}