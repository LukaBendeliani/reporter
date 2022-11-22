import { Workbook } from 'excel4node';

const exportXlsx = (columns, data) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    for (let i = 0; i < columns.length; i++) {
        worksheet.cell(1, i + 1).string(columns[i].title);
        for (let j = 0; j < data.length; j++) {
            worksheet.cell(j + 2, i + 1).string(`${data[j][columns[i].dataIndex]}`);
        }
    }

    return workbook;
};

export default exportXlsx;
