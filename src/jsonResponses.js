const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  if (status !== 204) {
    response.write(JSON.stringify(object));
  }

  response.end();
  // ✅ Explicit return
};

const getUsers = (request, response) => {
  const responseJSON = { users };
  respondJSON(request, response, 200, responseJSON);
};

const getUsersHead = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const addUser = (request, response) => {
  const responseJSON = { message: 'Name and age are both required.' };
  const { name, age } = request.body;

  if (!name || !age) {
    responseJSON.id = 'missingParams';
    respondJSON(request, response, 400, responseJSON);
    return;
  }

  let responseCode = 204;
  if (!users[name]) {
    responseCode = 201;
    users[name] = { name };
  }

  users[name].age = age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    respondJSON(request, response, responseCode, responseJSON);
    return;
  }

  response.writeHead(204);
  response.end();
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getUsers,
  addUser,
  getUsersHead,
  notFound,
};
