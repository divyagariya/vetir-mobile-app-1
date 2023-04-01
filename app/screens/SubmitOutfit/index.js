import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../colors';
import {BigImage, Buttons, Header, Input} from '../../components';
import {
  addOutfit,
  editOutfit,
  getOutfitsList,
} from '../../redux/actions/outfitActions';

const SubmitOutfit = props => {
  const [outfitName, setOutfitName] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const [selectedSeason, setSeason] = useState([]);
  const userId = useSelector(state => state.AuthReducer.userId);
  const [nameErr, setNameError] = useState('');
  const [descriptionErr, setDescErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [closetIds, setClosetIds] = useState([]);

  const addOutfitReponse = useSelector(
    state => state.OutfitReducer.addOutfitReponse,
  );

  const editOutfitRepsponse = useSelector(
    state => state.OutfitReducer.editOutfitRepsponse,
  );

  useEffect(() => {
    if (Object.keys(editOutfitRepsponse)) {
      if (editOutfitRepsponse.statusCode === 200) {
        dispatch(getOutfitsList());
        dispatch({type: 'EDIT_OUTFIT', value: {}});
        Toast.show('Outfit edit successfully');
        props.navigation.navigate('OutfitDetail', {
          outfitId: editOutfitRepsponse.outfitId,
        });
      }
    }
  }, [editOutfitRepsponse]);

  useEffect(() => {
    if (props?.route?.params?.editOutfitData) {
      setOutfitName(props?.route?.params?.editOutfitData?.name);
      let closetIds1 = [];
      setDescription(props?.route?.params?.editOutfitData?.description);
      props?.route?.params?.editOutfitData?.imageData?.map(item => {
        closetIds1.push(item.closetItemId);
      });
      setClosetIds(closetIds1);
      if (props?.route?.params?.editOutfitData?.seasons) {
        setSeason(props?.route?.params?.editOutfitData?.seasons);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(addOutfitReponse).length) {
      dispatch({type: 'ADD_OUTFIT', value: {}});
      if (addOutfitReponse.statusCode === 200) {
        Toast.show('Cloth successfully added in Outfit');
        dispatch(getOutfitsList());
        setLoading(false);
        props.navigation.navigate('Outfit');
      } else {
        setLoading(false);
      }
    }
  }, [addOutfitReponse, dispatch]);

  const setSeasonData = item => {
    let selectedSeason1 = [...selectedSeason] || [];
    if (!selectedSeason.includes(item)) {
      selectedSeason1.push(item);
    } else {
      selectedSeason1 = selectedSeason1.filter(i => i !== item);
    }

    setSeason(selectedSeason1);
  };

  const addOutfitData = () => {
    if (!outfitName) {
      setNameError('Please enter outfit name');
      return;
    }
    if (!description) {
      setDescErr('Please enter outfit description');
      return;
    }
    if (!selectedSeason.length) {
      Toast.show('Please select season');
      return;
    }
    let data = {
      userId: userId,
      closetItemIds: closetIds,
      outfitImageType:
        props?.route?.params?.outfitData?.imgSource?.data ||
        props?.route?.params?.editOutfitData?.outfitImageType,
      name: outfitName,
      description: description,
      seasons: selectedSeason,
      imageData:
        props?.route?.params?.outfitData?.imageData ||
        props?.route?.params?.editOutfitData?.imageData,
    };
    setLoading(true);
    if (props?.route?.params?.editOutfitData?.outfitId) {
      data.outfitId = props?.route?.params?.editOutfitData?.outfitId;
      dispatch(editOutfit(data));
      return;
    }
    console.warn('data', data);
    dispatch(addOutfit(data));
  };

  // alert(props?.route?.params?.editOutfitData?.outfitId);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header showBack {...props} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <BigImage
          imgSource={
            props?.route?.params?.editoutfit
              ? props?.route?.params?.editOutfitData?.outfitImageType
              : props?.route?.params?.outfitData?.imgSource?.data
          }
          showEdit={props?.route?.params?.editOutfitData?.outfitImageType}
          editImage={() =>
            props.navigation.navigate('AddOutfit', {
              editOutfitData: props?.route?.params?.editOutfitData,
              editoutfit: true,
            })
          }
        />
        <View style={{paddingHorizontal: 16}}>
          <Text style={{...styles.headingStyle, marginTop: 16}}>Name</Text>
          <Input
            placeholder="Name"
            onChangeText={e => {
              setOutfitName(e);
              setNameError('');
            }}
            value={outfitName}
            errorText={nameErr}
          />
          <Text style={styles.headingStyle}>Description</Text>
          <Input
            placeholder="Description"
            errorText={descriptionErr}
            onChangeText={e => {
              setDescription(e);
              setDescErr('');
            }}
            value={description}
          />
          <Text style={styles.headingStyle}>Season</Text>
          <View style={{flexDirection: 'row'}}>
            {['spring', 'summer', 'Autumn', 'winter'].map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSeasonData(item)}
                  style={[
                    styles.seasonContainer,
                    {
                      borderColor: selectedSeason?.includes(item)
                        ? Colors.black60
                        : 'rgba(0,0,0,0.16)',
                    },
                  ]}>
                  <Text style={{textTransform: 'capitalize'}}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{marginTop: 12, marginBottom: 30}}>
            <Buttons text="Add" onPress={addOutfitData} loading={loading} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SubmitOutfit;

const styles = StyleSheet.create({
  headingStyle: {
    // marginTop: 1,
  },
  seasonContainer: {
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
    borderColor: 'rgba(0,0,0,0.16)',
    marginTop: 8,
  },
});
