export const returnFilterParams = filterParams => {
  let data = filterParams;
  let data1 = {};
  if (data?.selectedCategory?.length) {
    data1.categoryIds = data.selectedCategory;
  }
  if (data?.selectedBrands?.length) {
    data1.brandIds = data.selectedBrands;
  }
  if (data?.selectedSubCategory?.length) {
    data1.subCategoryIds = data.selectedSubCategory;
  }
  if (data?.seasonData?.length) {
    data1.season = data.seasonData;
  }
  if (data?.colorsFilter?.length) {
    data1.color = data.colorsFilter;
  }
  if (data?.sizeFilter?.length) {
    data1.size = data.sizeFilter;
  }
  if (data?.genderData?.length) {
    data1.gender = data.genderData;
  }
  let priceFilters = [];
  if (data?.priceFilter?.length > 0) {
    data?.priceFilter.map(item => {
      if (item.isChecked) {
        priceFilters.push(item.min);
        if (item.max === 'and above') {
          priceFilters.push(10000);
        } else {
          priceFilters.push(item.max);
        }
      }
    });
    priceFilters = [...new Set(priceFilters)];
    priceFilters = [priceFilters[0], priceFilters[priceFilters.length - 1]];
    data1.price = priceFilters;
  }
  return data1;
};
