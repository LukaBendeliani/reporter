import { Report } from '../types/global';

const URL = `${process.env.REACT_APP_API}/reports`;

export const getReports = async (authToken: string) => {
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

export const getReport = async ({ queryKey }: any) => {
    const [_key, { authToken, reportId }] = queryKey;
    const options = {
        headers: {
            Authorization: authToken,
        },
    };

    try {
        const response = await fetch(`${URL}/report/${reportId}`, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
};

export const getPrimaryReports = async (inf: any) => {
    const { queryKey, pageParam = 1 } = inf;
    const [_key, { authToken }] = queryKey;

    const options = {
        headers: {
            Authorization: authToken,
        },
    };

    try {
        const response = await fetch(`${URL}/primary?page=${pageParam}`, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
};

export const postReport = async (authToken: string, values: Report) => {
    const options = {
        method: 'POST',
        headers: {
            Authorization: authToken,
            'Content-type': 'application/json',
        },
        body: JSON.stringify(values),
    };
    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
    } catch (error) {
        console.error(error);
    }
};

export const deleteReport = async (authToken: string, id: string) => {
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
    } catch (error) {
        console.error(error);
    }
};

export const formReport = async (
    authToken: string,
    reportId: string,
    parameters?: Record<string, string | number>,
    page = 1
) => {
    const options = {
        method: 'POST',
        headers: {
            Authorization: authToken,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ parameters, reportId, page }),
    };

    try {
        const response = await fetch(`${URL}/form`, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
};

export const exportReportXlsx = async (
    authToken: string,
    reportId: string,
    filename: string,
    parameters?: Record<string, string | number>
) => {
    const options = {
        method: 'POST',
        headers: {
            Authorization: authToken,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ parameters, reportId, xlsx: true }),
    };

    try {
        const response = await fetch(`${URL}/form`, options);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const headersFileName =
            response.headers.get('content-disposition')?.split('"')[1] || filename;

        const url = window.URL.createObjectURL(await response.blob());
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', headersFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error(error);
    }
};
