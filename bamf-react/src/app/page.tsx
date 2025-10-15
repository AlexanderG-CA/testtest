import HomePage from "@/components/HomePage";

// Simulate slow loading
//TODO: Remove this before production
async function getData() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {};
}

export default async function Home() {
  //TODO: Fetch real data here
  await getData();

  return <HomePage />;
}