const URL = `${process.env.REACT_APP_API}/params`;

export const getParams = async (authToken: string, reportId: string) => {
    const options = {
        headers: {
            Authorization: authToken,
        },
    };

    try {
        const response = await fetch(`${URL}?report_id=${reportId}`, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
};

export const postParam = async (
    authToken: string,
    report_id: string,
    values: Record<string, string>
) => {
    const options = {
        method: 'POST',
        headers: {
            Authorization: authToken,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            report_id,
            ...values,
        }),
    };

    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return;
    } catch (error) {
        console.error(error);
    }
};

export const putParam = async (
    authToken: string,
    id: string,
    paramType: string,
    paramCode: string,
    paramName: string,
    comboSql: string
) => {
    const options = {
        method: 'PUT',
        headers: {
            Authorization: authToken,
        },
        body: JSON.stringify({
            id,
            paramCode,
            paramName,
            paramType,
            comboSql,
        }),
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

export const deleteParam = async (authToken: string, id: string) => {
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: authToken,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ id }),
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

export const getComboOptions = async (authToken: string, comboSql: string) => {
    const options = {
        headers: {
            Authorization: authToken,
        },
    };

    try {
        const response = await fetch(`${URL}/combosql/${comboSql}`, options);

        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
};
