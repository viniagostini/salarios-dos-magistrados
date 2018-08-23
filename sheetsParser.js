const utils = require('./utils');
const sheetsService = require('./sheetsService');

/**
 * 
 * @param {Object} sheetsJsonObject - Object where the keys are the file name and 
 *                                    the value is the sheetObject.
 * @returns
 */
const sheetsParser = (sheetsJsonObject) => {

};

/**
 * 
 * @param {String} fileName 
 * @param {Object} sheetObject 
 */
const parseSheet = (fileName, sheetObject) => {
    const mes_ano_referencia = utils.parseFileNameToDate(fileName);
    


    // returns [{magistrado}]
};

//TODO: Find a better strategy than just list every possibility of sheet name.
const getContrachequeSheet = sheetObject => sheetObject["Contracheque"];

const getSubsidioSheet = sheetObject => sheetObject["Subsídio - Direitos Pessoais"] ||
                                        sheetObject['Subsídio -Vantagens Pessoais'] ||
                                        sheetObject['Subsídio - Direitos Pessoais(1)'] ||
                                        sheetObject['Subsídio -Direitos Pessoais'] ||
                                        sheetObject['Subsídio -Vantagens Pessoais'] ||
                                        sheetObject['Subsídio Direitos Pessoais'] ||
                                        sheetObject['Subsídio – Direitos Pessoais'] ||
                                        sheetObject['Subsídio_-_Direitos_Pessoais'] ||
                                        sheetObject['Direitos Pessoais'];

const getIndenizacoesSheet = sheetObject => sheetObject["Indenizações"] ||
                                            sheetObject["Indenizações "] ||
                                            sheetObject["Indenizações(2)"];

const getDireitosEventuaisSheet = sheetObject => sheetObject["Direitos Eventuais"] ||
                                                 sheetObject['Vantagens Eventuais'] ||
                                                 sheetObject['Direitos_Eventuais'] ||
                                                 sheetObject['Direitos Eventuais(3)'];

const getDadosCadastraisSheet = sheetObject => sheetObject["Dados Cadastrais"] ||
                                                sheetObject['Dados_Cadastrais'];

/**
 * Sanitize the passed value acordind to the type.
 * 
 * @param {String} data - value to be sanitized
 * @param {String} type - Can be: text | number 
 */
const clearData = (data, type) => {
    if (type === 'number') {
        return utils.clearNumberData(data);
    } else {
        return utils.clearTextData(data);
    }
};


/**
 * Checks if the line has the number of elements to fill the 
 * fields and if the the first fields has any content.
 * 
 * @param {Array} line 
 * @param {Integer} fieldsLength 
 * 
 * @returns {Boolean} true if it is a valid line.
 */
const isValidLine = (line, fieldsLength) => line.length >= fieldsLength && 
                                            !!line[1] && !!line[2] && line[1].length > 3;

/**
 * Returns the first data line of the sheet object.
 * 
 * @param {Object} sheetObject 
 */
const getFistDataLine = (sheetObject) => {
  let firstDataLine;

  sheetObject.some((line, index) => {
      firstDataLine = index + 1;
      return line.length > 0 && line[0] && line[1] && 
             (line[0].toLowerCase().includes('cpf')) &&
             (line[1].toLowerCase().includes('nome'));
  });

  return firstDataLine;
};


const getDataFromSheet = (sheetObject, fields) => {
    const sheetData = [];
    const firstDataLine = getFistDataLine(sheetObject);

    sheetObject.forEach((line, index) => {
        if (index < firstDataLine || !isValidLine(line, fields.length)) return;
        
        const magistradoData = {};

        fields.forEach((field, index) => {
            magistradoData[field.fieldName] = clearData(line[index], field.type);
            if (field.key) magistradoData.key = magistradoData[field.fieldName]; 
        });
        sheetData.push(magistradoData);
    });

    return sheetData; 
};
       
const getContrachequeData = contrachequeSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'cargo', type: 'text' },
        { fieldName: 'lotacao', type: 'text' },
        { fieldName: 'subsidio', type: 'number' },
        { fieldName: 'direitos_pessoias', type: 'number' },
        { fieldName: 'indenizacoes', type: 'number' },
        { fieldName: 'direitos_eventuais', type: 'number' },
        { fieldName: 'total_de__rendimentos', type: 'number' },
        { fieldName: 'previdencia_publica', type: 'number' },
        { fieldName: 'imposto_de_renda', type: 'number' },
        { fieldName: 'descontos_diversos', type: 'number' },
        { fieldName: 'retencao_por_teto_constitucional', type: 'number' },
        { fieldName: 'total_de_descontos', type: 'number' },
        { fieldName: 'rendimento_liquido', type: 'number' },
        { fieldName: 'remuneracao_do_orgao_de_origem', type: 'number' },
        { fieldName: 'diarias', type: 'number' }
    ];

    return getDataFromSheet(contrachequeSheet, fields);
};

const getSubsidioData = subsidioSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'abono_de_permanencia', type: 'number' },
        { fieldName: 'subsidio_outra1', type: 'number' },
        { fieldName: 'subsidio_detalhe1', type: 'text' },
        { fieldName: 'subsidio_outra2', type: 'number' },
        { fieldName: 'subsidio_detalhe2', type: 'text' },
        { fieldName: 'total_de_direitos_pessoais', type: 'number' },
    ];

    return getDataFromSheet(subsidioSheet, fields);
};

const getIndenizacoesData = indenizacoesSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'auxilio_alimentacao', type: 'number' },
        { fieldName: 'auxilio_pre_escolar', type: 'number' },
        { fieldName: 'auxilio_saude', type: 'number' },
        { fieldName: 'auxilio_natalidade', type: 'number' },
        { fieldName: 'auxilio_moradia', type: 'number' },
        { fieldName: 'ajuda_de_custo', type: 'number' },
        { fieldName: 'indenizacoes_outra1', type: 'number' },
        { fieldName: 'indenizacoes_detalhe1', type: 'text' },
        { fieldName: 'indenizacoes_outra2', type: 'number' },
        { fieldName: 'indenizacoes_detalhe2', type: 'text' },
        { fieldName: 'indenizacoes_outra3', type: 'number' },
        { fieldName: 'indenizacoes_detalhe3', type: 'text' },
        { fieldName: 'total_indenizacoes', type: 'number' },
    ];

    return getDataFromSheet(indenizacoesSheet, fields);
};


const getDireitosEventuaisData = direitosEventuaisSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'abono_contitucional_de_1_3_de_ferias', type: 'number' },
        { fieldName: 'indenizacao_de_ferias', type: 'number' },
        { fieldName: 'antecipacao_de_ferias', type: 'number' },
        { fieldName: 'gratificacao_natalina', type: 'number' },
        { fieldName: 'antecipacao_de_gratificacao_natalina', type: 'number' },
        { fieldName: 'substituicao', type: 'number' },
        { fieldName: 'gratificacao_por_exercicio_cumulativo', type: 'number' },
        { fieldName: 'gratificacao_por_encargo_curso_concurso', type: 'number' },
        { fieldName: 'pagamento_em_retroativos', type: 'number' },
        { fieldName: 'jeton', type: 'number' },
        { fieldName: 'direitos_eventuais_outra1', type: 'number' },
        { fieldName: 'direitos_eventuais_detalhe1', type: 'text' },
        { fieldName: 'direitos_eventuais_outra2', type: 'number' },
        { fieldName: 'direitos_eventuais_detalhe2', type: 'text' },
        { fieldName: 'total_de_direitos_eventuais', type: 'number' },
    ];

    return getDataFromSheet(direitosEventuaisSheet, fields);
};

const getDadosCadastraisData = dadosCadastraisSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'matricula', type: 'text' },
        { fieldName: 'lotacao_de_origem', type: 'text' },
        { fieldName: 'orgao_de_origem', type: 'text' },
        { fieldName: 'cargo_de_origem', type: 'text' },
        
    ];

    return getDataFromSheet(dadosCadastraisSheet, fields);
};