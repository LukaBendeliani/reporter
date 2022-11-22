const URL = `${process.env.REACT_APP_API}/users`;

type Values = {
    username: string;
    password: string;
};

const signIn = async (values: Values) => {
    const options = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
            'Content-type': 'application/json',
        },
    };

    try {
        const response = await fetch(`${URL}/login`, options);
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message);
        }
        const json = await response.json();
        return json;
    } catch (error: any) {
        throw new Error(error);
    }
};

export { signIn };
