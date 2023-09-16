const fetchHello = async () => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello",
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { fetchHello };
