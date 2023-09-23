import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Styles} from './styles';
import DashboardHeader from '../../components/DashboardHeader';
import MeasurementAndSizeCard from '../../components/MeasurementAndSizeCard';

const MeasurementArray = [
  {
    id: 1,
    title: 'Hip',
    count: '23',
  },
  {
    id: 2,
    title: 'Waist',
    count: '25',
  },
  {
    id: 3,
    title: 'Chest',
    count: '23',
  },
  {
    id: 4,
    title: 'Shoulder',
    count: '23',
  },
  {
    id: 5,
    title: 'Inseam',
    count: '23',
  },
  {
    id: 6,
    title: 'Outseam',
    count: '23',
  },
];

const SizesArray = [
  {
    id: 1,
    title: 'Shoe',
    count: '23',
  },
  {
    id: 2,
    title: 'Toe',
    count: '25',
  },
];

const ProfileDetails = props => {
  const {navigation} = props;
  const {userName, gender, phone, email, add} = props.route.params || '';
  return (
    <View style={Styles.container}>
      <DashboardHeader navigation={navigation} headerText={userName} />
      <ScrollView>
        <View style={Styles.detailsContainer}>
          <Text style={Styles.profileText}>{gender}</Text>
          <Text style={Styles.profileText}>{email}</Text>
          {/* <Text style={Styles.profileText}>{`Ph: ${phone}`}</Text> */}
          {/* <Text style={Styles.profileText}>{`Add: ${add}`}</Text> */}
        </View>
        <Text style={Styles.heading}>Measurements</Text>
        {MeasurementArray.map((item, index) => {
          return (
            <MeasurementAndSizeCard
              key={item.id}
              showBorder={index === MeasurementArray.length - 1 ? false : true}
              title={item.title}
              count={item.count}
            />
          );
        })}
        <Text style={Styles.heading}>Sizes</Text>
        {SizesArray.map((item, index) => {
          return (
            <MeasurementAndSizeCard
              key={item.id}
              showBorder={index === SizesArray.length - 1 ? false : true}
              title={item.title}
              count={item.count}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};
export default ProfileDetails;
