const mongoose = require("mongoose");
/**
 * @ Custom Response Helper
 */

const customResponse = ({
  code = 200,
  status,
  message = "",
  data = {},
  err = {},
  totalResult,
  totalCount,
  totalPage,
}) => {
  const responseStatus = status ? status : code < 300 ? true : false;
  return {
    success: responseStatus,
    code,
    totalResult,
    totalCount,
    data,
    message,
    error: err,
    totalPage,
  };
};

/**
 * @ Custom Pagination Helper
 */
const customPagination = ({ data = [], limit = 15, page = 1 }) => {
  const totalCount = data.length;
  const pageCount = Math.ceil(totalCount / limit);
  const currentPage = page;
  const results = data.slice((page - 1) * limit, page * limit);
  return {
    pageCount,
    totalCount,
    currentPage,
    results,
  };
};

module.exports = {
  customResponse,
  customPagination,
};
