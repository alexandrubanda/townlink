const axios = require('axios');

async function testQuery() {
  const apiUrl = 'http://localhost:3000/query';
  const userQuery = 'Cum obtin viza de flotant?';

  try {
    const response = await axios.post(apiUrl, { query: userQuery });
    console.log('Response from AI assistant:');
    console.log(response.data.answer);
  } catch (error) {
    console.error('Error making API request:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testQuery();
