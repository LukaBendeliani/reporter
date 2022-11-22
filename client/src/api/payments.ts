const URL = `${process.env.REACT_APP_API}/payments`;

export const getPayments = async (authToken: string) => {
    const options = {
        headers: {
            Authorization: authToken,
        },
    };

    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
};
