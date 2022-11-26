import lodash from 'lodash';

const { isEmpty } = lodash;

export const parametersToQuery = (parameters, initialQuery, page) => {
    let query = initialQuery;
    let values = [];

    console.log(parameters, initialQuery);

    if (!isEmpty(parameters) && !Object.values(parameters).every((p) => !p)) {
        query += ' WHERE ';
        Object.entries(parameters).forEach(([key, value], index, arr) => {
            if (key && value) {
                const [paramName, paramType] = key.split('.');
                switch (paramType) {
                    case 'text': {
                        query += `${paramName} LIKE '%' || :${values.length + 1} || '%'`;
                        values.push(value);
                        break;
                    }
                    case 'number': {
                        query += `${paramName} >= :${values.length + 1}`;
                        values.push(value);
                        break;
                    }
                    case 'combo':
                    case 'date': {
                        query += `${paramName} = :${values.length + 1}`;
                        values.push(value);
                        break;
                    }
                    default:
                        break;
                }

                if (arr.length - 1 !== index) {
                    query += ' AND ';
                }
            }
        });
    }

    if (page) {
        query += ` OFFSET ${page * 10 - 10} ROWS FETCH NEXT 10 ROWS ONLY`;
    }

    console.log(query, values);

    return { query, values };
};
