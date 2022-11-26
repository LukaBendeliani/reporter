const ERROR_MESSAGE = 'Something went wrong, please contact site administrator!';

const handleError = (res, message) => {
    console.log(message);
    res.status(500).send(message || ERROR_MESSAGE);
};

export default handleError;
