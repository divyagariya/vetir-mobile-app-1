import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {Buttons, Input} from '../../components';
import Toast from 'react-native-simple-toast';
import {
  getPreferencesAnswers,
  getUserProfile,
  submitPrefernces,
} from '../../redux/actions/profileAction';

const YourPreferences = props => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [currentActiveTab, setCurrentActiveTab] = useState(1);
  const [firstQuestionData, setFirstQuestions] = useState([]);
  const [secondQuestionData, setsecondQuestionData] = useState([]);
  const [thirdQuestionData, setThirdQuestions] = useState([]);
  const [forthQuestionData, setForthQuestions] = useState([]);
  const [fifthQuestionData, setFifthQuestions] = useState([]);
  const [sixthQuestionData, setSixthQuestions] = useState([]);
  const [seventhQuestionData, setSeventhQuestions] = useState([]);
  const [preferencesObj, setPreferencesObj] = useState([]);
  const [colorCodes7, setColorCodes7] = useState([]);
  const [brandSearchKey, setBrandSearchKey] = useState('');
  const [colorCodes, setColorCodes] = useState([]);
  const preferencesQsResponse =
    useSelector(state => state.ProfileReducer.preferencesQsResponse) || [];
  const preferencesAnswersResp =
    useSelector(state => state.ProfileReducer.preferencesAnswersResp) || [];
  const submitPrefResp =
    useSelector(state => state.ProfileReducer.submitPrefResp) || [];
  const [brandList, setBrandList] = useState(preferencesQsResponse[0].options);
  const userId = useSelector(state => state.AuthReducer.userId);

  // useEffect(() => {
  //   dispatch(getPreferencesAnswers());
  // }, [dispatch]);

  useEffect(() => {
    if (
      submitPrefResp?.prefrences?.length ||
      submitPrefResp[0]?.prefrences?.length
    ) {
      dispatch({type: 'SUBMIT_PREFERENCES', value: []});
      dispatch(getUserProfile());
      Toast.show('Your preferences added successfully');
      props.navigation.navigate('Home');
      dispatch(getPreferencesAnswers());
    }
  }, [submitPrefResp]);

  useEffect(() => {
    if (preferencesAnswersResp.length) {
      let firstQuestionData1 = [];
      let secondQuestionData1 = [];
      let thirdQuestionData1 = [];
      let forthQuestionData1 = [];
      let fifthQuestionData1 = [];
      let sixthQuestionData1 = [];
      let seventhQuestionData1 = [];
      let setColorCodes1 = [];
      let colorCode8 = [];
      preferencesAnswersResp.map(item => {
        if (item.questionId === 1) {
          item.options.forEach(i => {
            firstQuestionData1.push(i.optionId);
          });
        }
        if (item.questionId === 2) {
          item.options.forEach(i => {
            secondQuestionData1.push(i.optionId);
          });
        }
        if (item.questionId === 3) {
          item.options.forEach(i => {
            thirdQuestionData1.push(i.optionId);
          });
        }
        if (item.questionId === 4) {
          item.options.forEach(i => {
            forthQuestionData1.push(i.optionId);
          });
        }
        if (item.questionId === 5) {
          item.options.forEach(i => {
            fifthQuestionData1.push(i.optionId);
          });
        }
        if (item.questionId === 6) {
          item.options.forEach(i => {
            sixthQuestionData1.push(i.optionId);
            setColorCodes1.push(i.colorCode);
          });
        }
        if (item.questionId === 7) {
          item.options.forEach(i => {
            seventhQuestionData1.push(i.optionId);
            colorCode8.push(i.colorCode);
          });
        }
      });
      setFirstQuestions(firstQuestionData1);
      setsecondQuestionData(secondQuestionData1);
      setThirdQuestions(thirdQuestionData1);
      setForthQuestions(forthQuestionData1);
      setFifthQuestions(fifthQuestionData1);
      setSixthQuestions(sixthQuestionData1);
      setSeventhQuestions(seventhQuestionData1);
      setColorCodes(setColorCodes1);
      setColorCodes7(colorCode8);
    }
  }, [preferencesAnswersResp]);

  useEffect(() => {
    if (colorCodes.length === 3) {
      let index = -1;
      let colorCodes8 = [...colorCodes7];
      const found = colorCodes.some(r => {
        index = colorCodes7.indexOf(r);
      });
      if (index !== -1) {
        colorCodes8.splice(index, 1);
        setColorCodes7(colorCodes8);
        setSeventhQuestions([]);
      }
    }
  }, [colorCodes, colorCodes7]);

  const setBrandsFilter = item => {
    if (currentActiveTab === 7 && colorCodes.includes(item.colorCode)) {
      return;
    }
    if (currentActiveTab === 1) {
      let firstQuestionData1 = [...firstQuestionData];
      if (firstQuestionData1.includes(item.optionId)) {
        firstQuestionData1 = firstQuestionData1.filter(
          i => i !== item.optionId,
        );
      } else {
        if (firstQuestionData.length < 5) {
          firstQuestionData1.push(item.optionId);
        }
      }
      setFirstQuestions(firstQuestionData1);
    }
    if (currentActiveTab === 2) {
      let firstQuestionData1 = [...secondQuestionData];
      if (firstQuestionData1.includes(item.optionId)) {
        firstQuestionData1 = firstQuestionData1.filter(
          i => i !== item.optionId,
        );
      } else {
        if (secondQuestionData.length < 5) {
          firstQuestionData1.push(item.optionId);
        }
      }
      setsecondQuestionData(firstQuestionData1);
    }
    if (currentActiveTab === 3) {
      let firstQuestionData1 = [...thirdQuestionData];
      if (firstQuestionData1.includes(item.optionId)) {
        firstQuestionData1 = firstQuestionData1.filter(
          i => i !== item.optionId,
        );
      } else {
        if (thirdQuestionData.length < 5) {
          firstQuestionData1.push(item.optionId);
        }
      }
      setThirdQuestions(firstQuestionData1);
    }
    if (currentActiveTab === 4) {
      let firstQuestionData1 = [...forthQuestionData];
      if (firstQuestionData1.includes(item.optionId)) {
        firstQuestionData1 = firstQuestionData1.filter(
          i => i !== item.optionId,
        );
      } else {
        if (forthQuestionData.length < 5) {
          firstQuestionData1.push(item.optionId);
        }
      }
      setForthQuestions(firstQuestionData1);
    }
    if (currentActiveTab === 5) {
      let firstQuestionData1 = [...fifthQuestionData];
      if (firstQuestionData1.includes(item.optionId)) {
        firstQuestionData1 = firstQuestionData1.filter(
          i => i !== item.optionId,
        );
      } else {
        if (fifthQuestionData.length < 5) {
          firstQuestionData1.push(item.optionId);
        }
      }
      setFifthQuestions(firstQuestionData1);
    }
    if (currentActiveTab === 6) {
      let colorCodes1 = [...colorCodes];
      if (colorCodes1.includes(item.colorCode)) {
        colorCodes1 = colorCodes1.filter(i => i !== item.colorCode);
      } else {
        if (sixthQuestionData.length < 3) {
          colorCodes1.push(item.colorCode);
        }
      }
      let firstQuestionData1 = [...sixthQuestionData];
      if (firstQuestionData1.includes(item.optionId)) {
        firstQuestionData1 = firstQuestionData1.filter(
          i => i !== item.optionId,
        );
      } else {
        if (sixthQuestionData.length < 3) {
          firstQuestionData1.push(item.optionId);
        }
      }
      setColorCodes(colorCodes1);
      setSixthQuestions(firstQuestionData1);
    }
    if (currentActiveTab === 7) {
      let colorCodes1 = [...colorCodes7];
      if (colorCodes1.includes(item.colorCode)) {
        colorCodes1 = colorCodes1.filter(i => i !== item.colorCode);
      } else {
        if (sixthQuestionData.length < 3) {
          colorCodes1.push(item.colorCode);
        }
      }
      let firstQuestionData1 = [...seventhQuestionData];
      if (firstQuestionData1.includes(item.optionId)) {
        firstQuestionData1 = firstQuestionData1.filter(
          i => i !== item.optionId,
        );
      } else {
        if (seventhQuestionData.length < 3) {
          firstQuestionData1.push(item.optionId);
        }
      }
      setColorCodes7(colorCodes1);
      setSeventhQuestions(firstQuestionData1);
    }
  };

  const searchBrand = e => {
    setBrandSearchKey(e);
    let allBrandList = preferencesQsResponse[currentActiveTab - 1].options;
    allBrandList = allBrandList.filter(i => {
      return i.optionName.toLowerCase().includes(e.toLowerCase());
    });
    setBrandList(allBrandList);
  };

  const getFirstPage = () => {
    const data = preferencesQsResponse[0];
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <>
          <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 16}}>
            {data.question}
          </Text>
          <Input
            placeholder="Search Brands"
            onChangeText={e => searchBrand(e)}
            value={brandSearchKey}
          />
          {renderList(brandList, firstQuestionData)}
        </>
      </View>
    );
  };

  const handleNext = () => {
    if (currentActiveTab === 1 && firstQuestionData.length < 5) {
      Toast.show('Please select minimum 5 brands');
      return;
    }
    if (currentActiveTab === 2 && secondQuestionData.length < 5) {
      Toast.show('Please select minimum 5 denim brands');
      return;
    }
    if (currentActiveTab === 3 && thirdQuestionData.length < 5) {
      Toast.show('Please select minimum 5 shoe brands');
      return;
    }
    if (currentActiveTab === 4 && forthQuestionData.length < 5) {
      Toast.show('Please select minimum 5 dress brands');
      return;
    }
    if (currentActiveTab === 5 && fifthQuestionData.length < 5) {
      Toast.show('Please select minimum 5 handbags brands');
      return;
    }
    if (currentActiveTab === 6 && sixthQuestionData.length < 3) {
      Toast.show('Please select minimum 3 colors');
      return;
    }
    if (currentActiveTab === 7 && seventhQuestionData.length < 3) {
      Toast.show('Please select minimum 3 colors not like to wear');
      return;
    }
    ref.current?.scrollTo({
      y: 0,
      animated: true,
    });
    if (currentActiveTab === 7) {
      let data = {
        userId: userId,
        prefrences: [
          {
            questionId: preferencesQsResponse[0].questionId,
            optionIds: firstQuestionData,
          },
          {
            questionId: preferencesQsResponse[1].questionId,
            optionIds: secondQuestionData,
          },
          {
            questionId: preferencesQsResponse[2].questionId,
            optionIds: thirdQuestionData,
          },
          {
            questionId: preferencesQsResponse[3].questionId,
            optionIds: forthQuestionData,
          },
          {
            questionId: preferencesQsResponse[4].questionId,
            optionIds: fifthQuestionData,
          },
          {
            questionId: preferencesQsResponse[5].questionId,
            optionIds: sixthQuestionData,
          },
          {
            questionId: preferencesQsResponse[6].questionId,
            optionIds: seventhQuestionData,
          },
        ],
      };
      console.log('@@ submit pref', JSON.stringify(data, undefined, 2));
      dispatch(submitPrefernces(data));
      return;
    }
    setCurrentActiveTab(currentActiveTab + 1);
    setBrandSearchKey('');
    setBrandList(preferencesQsResponse[currentActiveTab].options);
  };

  const handleBack = () => {
    ref.current?.scrollTo({
      y: 0,
      animated: true,
    });
    setCurrentActiveTab(currentActiveTab - 1);
    setBrandList(preferencesQsResponse[currentActiveTab - 2].options);
  };

  console.log('@@ colorCodes', colorCodes);

  const renderList = (data, answers) => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setBrandsFilter(item)}
              style={{
                borderWidth: 1,
                opacity:
                  currentActiveTab === 7 && colorCodes.includes(item.colorCode)
                    ? 0.3
                    : 1,
                padding: 8,
                marginRight: 8,
                borderColor: Colors.greyBorder,
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: answers.includes(item.optionId)
                  ? '#DBDBDB'
                  : 'transparent',
                alignItems: 'center',
              }}>
              {item.colorCode ? (
                <View
                  style={{
                    backgroundColor: item.colorCode,
                    height: 40,
                    width: 40,
                    marginRight: 4,
                  }}
                />
              ) : null}
              <Text>{item.optionName}</Text>
              {answers.includes(item.optionId) ? (
                <Image
                  source={require('../../assets/crossIcon.png')}
                  style={{width: 12, height: 12, marginLeft: 8}}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const getSecondPage = () => {
    const data = preferencesQsResponse[1];
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <>
          <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 16}}>
            {data.question}
          </Text>
          <Input
            placeholder="Search Brands"
            onChangeText={e => searchBrand(e)}
            value={brandSearchKey}
          />
          {renderList(brandList, secondQuestionData)}
        </>
      </View>
    );
  };

  const getThirdPage = () => {
    const data = preferencesQsResponse[2];
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <>
          <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 16}}>
            {data.question}
          </Text>
          <Input
            placeholder="Search Brands"
            onChangeText={e => searchBrand(e)}
            value={brandSearchKey}
          />
          {renderList(brandList, thirdQuestionData)}
        </>
      </View>
    );
  };

  const getFourthPage = () => {
    const data = preferencesQsResponse[3];
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <>
          <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 16}}>
            {data.question}
          </Text>
          <Input
            placeholder="Search Brands"
            onChangeText={e => searchBrand(e)}
            value={brandSearchKey}
          />
          {renderList(brandList, forthQuestionData)}
        </>
      </View>
    );
  };

  const getFifthPage = () => {
    const data = preferencesQsResponse[4];
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <>
          <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 16}}>
            {data.question}
          </Text>
          <Input
            placeholder="Search Brands"
            onChangeText={e => searchBrand(e)}
            value={brandSearchKey}
          />
          {renderList(brandList, fifthQuestionData)}
        </>
      </View>
    );
  };

  console.log('@@ sixth', sixthQuestionData);

  const getSixthPage = () => {
    const data = preferencesQsResponse[5];
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <>
          <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 16}}>
            {data.question}
          </Text>
          <Input
            placeholder="Search Brands"
            onChangeText={e => searchBrand(e)}
            value={brandSearchKey}
          />
          {renderList(brandList, sixthQuestionData)}
        </>
      </View>
    );
  };

  const getSeventhPage = () => {
    const data = preferencesQsResponse[6];
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <>
          <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 16}}>
            {data.question}
          </Text>
          <Input
            placeholder="Search Brands"
            onChangeText={e => searchBrand(e)}
            value={brandSearchKey}
          />
          {renderList(brandList, seventhQuestionData)}
        </>
      </View>
    );
  };

  return (
    <View
      style={{padding: 16, flex: 1, backgroundColor: 'white', paddingTop: 20}}>
      <TouchableOpacity
        style={{position: 'absolute', top: 20, right: 16, zIndex: 999}}
        onPress={() => props.navigation.goBack()}>
        <Image
          source={require('../../assets/cross.webp')}
          style={{width: 44, height: 44}}
        />
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        {preferencesQsResponse.length > 0 &&
          preferencesQsResponse.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: Dimensions.get('window').width / 9,
                  borderWidth: 1,
                  marginRight: 8,
                  borderColor:
                    currentActiveTab >= index + 1
                      ? Colors.black
                      : Colors.greyBorder,
                }}
              />
            );
          })}
      </View>
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{paddingTop: 40}} ref={ref}>
          {currentActiveTab === 1
            ? getFirstPage()
            : currentActiveTab === 2
            ? getSecondPage()
            : currentActiveTab === 3
            ? getThirdPage()
            : currentActiveTab === 4
            ? getFourthPage()
            : currentActiveTab === 5
            ? getFifthPage()
            : currentActiveTab === 6
            ? getSixthPage()
            : currentActiveTab === 7
            ? getSeventhPage()
            : null}
        </ScrollView>

        <Buttons text="next" onPress={handleNext} />
        {currentActiveTab > 1 && (
          <Buttons text="back" isInverse onPress={handleBack} />
        )}
      </View>
    </View>
  );
};

export default YourPreferences;
