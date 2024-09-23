export async function handler(event) {
  const infos = event.requestContext.authorizer.jwt

  return {
    statusCode: 201,
    body: JSON.stringify(infos),
  }
}