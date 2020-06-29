import * as _ from 'lodash';
import * as moment from 'moment';
import {
  createValidate,
  isEmptyArray,
  isEmptyString,
  isInvalidDates,
  isPhoneNumber,
} from './pureFunctions';

const webSitePattern = /^((https?|s?ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

export const isRequired = {
  ...createValidate(v => {
    return v === undefined || v === null || isEmptyString(v);
  }, 'Пожалуйста заполните поле!'),
  validateType: 'requiredValidator',
};

export const isDateAfter = (dateAfter: string, err: string) => ({
  ...createValidate((v, storeData) => moment(storeData[dateAfter]).isAfter(v), err),
  validateType: 'requiredValidator',
});

export const isCorrectDates = {
  ...createValidate(isInvalidDates, 'Please fill this field!'),
  validateType: 'requiredValidator',
};

export const isNotEmptyArray = {
  ...createValidate(isEmptyArray, 'Please fill this field!'),
  validateType: 'requiredValidator',
};

export const isNotEmptyImageList = {
  ...createValidate(isEmptyArray, 'Please add image here!'),
  validateType: 'requiredValidator',
};

export const isNotEmptyDocumentList = {
  ...createValidate(isEmptyArray, 'Please add document here!'),
  validateType: 'requiredValidator',
};

export const isConfirm = {
  ...createValidate(value => value !== true, 'You must confirm this block before next actions'),
  validateType: 'requiredValidator',
};

export const isConfirmSimplex = {
  ...createValidate(
    value => value !== true,
    'Please read the Agreement and accept its terms before purchase'
  ),
  validateType: 'requiredValidator',
};

export const isBoolean = {
  ...createValidate(value => typeof value !== 'boolean', 'You must fill this field!'),
  validateType: 'requiredValidator',
};

export const isName = {
  pattern: /^[\s\dA-Za-z'.-]+$/gi,
  message: "Please use latin characters and symbols '.-",
};

export const isAddress = {
  pattern: /^[\s\dA-Za-z,.\-"']+$/gi,
  message: 'Please use latin characters and symbols ,.-"\'',
};

export const notEnoughCharacters = { min: 2, message: 'Not enough characters' };

export const maxCharacters = { max: 255, message: 'Maximum string length is 255 characters' };

export const isNumber = {
  pattern: /^[\d]+$/gi,
  message: 'Numbers only, no dash or any other separator.',
  whitespace: true,
};

export const isFloatingNumber = {
  pattern: /^[+-]?([0-9]*[.])?[0-9]+$/gi,
  message: 'Numbers only, no dash or any other separator.',
  whitespace: true,
};

export const isWebsite = {
  pattern: webSitePattern,
  message: 'Website url not correct',
};

export const isYoutube = createValidate(v => !webSitePattern.test(v), 'Youtube url not correct');

export const isNotChannel = createValidate(
  v => v.indexOf('channel') !== -1,
  `Can't be a channel url`
);

export const isEmail = {
  pattern: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
  message: 'E-mail not correct',
};

export const isPositive = createValidate(v => _.isNumber(v) && v <= 0, 'Positive number only!');

// * Kits - grouping rules * //

export const phoneNumberRules = [
  isRequired,
  { min: 2 },
  createValidate(
    v => v && !isPhoneNumber(v.replace(/\D/g, '')),
    'Please enter valid phone number!'
  ),
];

export const def = {
  name: [isName, notEnoughCharacters, maxCharacters],
  address: [isAddress, notEnoughCharacters],
};
