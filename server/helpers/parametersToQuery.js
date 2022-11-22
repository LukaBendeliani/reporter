import lodash from 'lodash';

const { isEmpty } = lodash;

export const parametersToQuery = (parameters, initialQuery, page) => {
    let query = initialQuery;
    let values = [];

    if (!isEmpty(parameters) && !Object.values(parameters).every((p) => !p)) {
        query += ' WHERE ';
        Object.entries(parameters).forEach(([key, value], index, arr) => {
            if (key && value) {
                const [paramName, paramType] = key.split('.');
                switch (paramType) {
                    case 'text': {
                        query += `${paramName} ~ $${values.length + 1}`;
                        values.push(value);
                        break;
                    }
                    case 'number': {
                        query += `${paramName} >= $${values.length + 1}`;
                        values.push(value);
                        break;
                    }
                    case 'combo':
                    case 'date': {
                        query += `${paramName} = $${values.length + 1}`;
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
        query += ` LIMIT 10 OFFSET ${page * 10 - 10}`;
    }

    return { query, values };
};
