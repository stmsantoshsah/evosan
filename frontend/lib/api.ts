// evosan/frontend/lib/api.ts

// 1. Define the base URL without a trailing slash
const API_URL = 'http://127.0.0.1:8000'; 

export async function getSystemStatus() {
  try {
    // 2. We explicitly append the slash here
    console.log(`Fetching from: ${API_URL}/`); 
    
    const res = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      // If the backend returns 404 or 500, throw an error
      throw new Error(`Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return { status: "Offline", message: "Cannot connect to backend" };
  }
}