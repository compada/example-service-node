import axios from "axios";

const managementToken = async () => {
  const options = {
    method: "POST",
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: {
      "content-type": "application/json",
      "Accept-Encoding": "gzip,deflate,compress"
    },
    data: {
      grant_type: "client_credentials",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
    }
  };

  const response = await axios.request(options).catch(error => {
    console.error(error);
  });
  return `${response.data.token_type} ${response.data.access_token}`;
};

export const user = async (userId) => {
  const options = {
    method: "GET",
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    headers: {
      authorization: await managementToken(),
      "Accept-Encoding": "gzip,deflate,compress"
    }
  };

  const response = await axios.request(options).catch(error => {
    console.error(error);
  });
  return response.data;
};
