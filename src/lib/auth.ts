export async function getAuthToken() {
  try {
    const response = await fetch('/api/token');
    console.log('Response:', response);
    if (!response.ok) return null;
    const data = await response.json();
    console.log('Data:', data);
    return data.token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
}