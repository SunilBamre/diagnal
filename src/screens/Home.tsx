import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    TextInput,
    Dimensions,
  } from 'react-native';
import movieData1 from '../json/CONTENTLISTINGPAGE-PAGE1.json';
import movieData2 from '../json/CONTENTLISTINGPAGE-PAGE2.json';
import movieData3 from '../json/CONTENTLISTINGPAGE-PAGE3.json';

const windowWidth = Dimensions.get('window').width;
  
function Home() {
    const [movies, setMovies] = useState([]);
    const [category, setCategory] = useState('');
    const [searchTxt, setSearchTxt] = useState('');
    const [visibility, setVisibility] = useState(false);
    const [loadCount, setLoadCount] = useState(1);

    var posterimage = require("../assets/images/poster6.jpg"); 

    const getMovies = () => {
        let dataArray = [movieData1]
        if(loadCount == 2){
            dataArray.push(movieData2);
        }else if(loadCount == 3){
            dataArray.push(movieData3);
        }
        const movieDetails = dataArray.flatMap((item) => {
            const categoryValue = item.page.title;
            setCategory(categoryValue);
            return item.page["content-items"].content.map((movieItem) => {
                return movieItem;
            });
        })
        setMovies(movieDetails);
    }

    const loadMoreData = (index) => {
        let incrementer = loadCount + index.distanceFromEnd+1;
        if(incrementer <= 3){
            setLoadCount(incrementer);
        }
    }

    const getSearchResult = (val : string) => {
        if(val.length !== 0){
            const searchkeyword = val.toLowerCase();
            const result = movies.filter((item) => {
                const title = item.name.toLowerCase();
                return title.includes(searchkeyword);
            })
            setSearchTxt(val);
            setMovies(result);
        }else{
            setSearchTxt('');
            getMovies();
        }
    }

    useEffect(() => {
        getMovies();
    },[loadCount]);

    return (
        <SafeAreaView style={styles.container}>
            <>
               
                <ImageBackground source={require('../assets/images/nav_bar.png')} resizeMode="cover" style={styles.navBar}>
                    {visibility ? 
                        <View style={styles.searchView}>
                            <TouchableOpacity onPress={()=> {setVisibility(false), getMovies(), setSearchTxt('')}}>
                                <Image
                                    style={styles.backIcon}
                                    source={require('../assets/images/Back.png')}
                                />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.inputBox}
                                onChangeText={(val) => getSearchResult(val)}
                                value={searchTxt}
                                placeholder='Search by name'
                                placeholderTextColor='white'
                                autoFocus={true}
                                selectionColor={'#ffe300'}
                            />
                        </View>
                    :
                        <View style={styles.navBarView}>
                            <Text style={styles.navBarTitle}>{category}</Text>
                            <TouchableOpacity onPress={()=> setVisibility(true)}>
                                <Image
                                    style={styles.searchIcon}
                                    source={require('../assets/images/search.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </ImageBackground>

                <FlatList
                    contentContainerStyle={styles.flatlistContainer}
                    columnWrapperStyle={styles.flatlistWrapper}  
                    style={styles.flatlist}
                    data={movies}
                    renderItem={({item,index}) => (
                        <View style={styles.listItem}>
                            {/* Issue with dynamic image path in source attribute when fetching data from local json
                                <Image
                                style={styles.posterImg}
                                source={`require('../assets/images/${item['poster-image']}')`}
                            /> */}
                            {posterimage !== null ? 
                                <Image
                                    style={styles.posterImg}
                                    source={posterimage}
                                />
                            :
                                <Image
                                    style={styles.posterImg}
                                    source={require('../assets/images/placeholder_for_missing_posters.png')}
                                />
                            }
                            <Text style={styles.movieName} numberOfLines={1}>{item.name}</Text>    
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyLayout}>
                            <Text style={styles.emptyTxt}>
                                No Result Found
                            </Text>
                        </View>
                    }
                    keyExtractor={(item, index) => JSON.stringify(item)+index}
                    numColumns={3}
                    onEndReached={(e) => loadMoreData(e)}
                />
                
                
            </>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121',
    },

    // Navbar style open
    navBar: {
        padding: 15,
        minHeight: 72,
        backgroundColor: 'transparent',
    },
    navBarView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBarTitle: {
        color: 'white',
        fontSize: 18,
        flex: 1,
        fontFamily: 'TitilliumWeb-Bold',
    },
    searchIcon: {
        width: 25,
        height: 25,
    },
    // Navbar style close

    // Search box style open
    searchView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backIcon: {
        width: 25,
        height: 25,
    },
    inputBox: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
        color: 'white',
        fontSize: 16,
        paddingRight:15,
    },
    // Search box style close

    // Flatlist style open
    flatlistContainer: {
        paddingHorizontal: 30,
        // marginTop: -15,
    },
    flatlistWrapper: {
        justifyContent: 'space-evenly',
    },
    flatlist: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        flex: 1,
    },
    listItem: {
        marginHorizontal: 30,
        marginBottom: 30,
    },
    posterImg:{
        borderRadius: 5,
        width: (windowWidth - 60) / 3,
        height: 272,
        resizeMode: 'cover',
    },
    movieName: {
        fontSize: 16,
        color: '#ffffff',
        width: (windowWidth - 60) / 3,
        marginTop: 5,
        fontFamily: 'TitilliumWeb-Regular',
    },
    // Flatlist style close

    // Empty result style open
    emptyLayout: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTxt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        marginTop: 50,
        fontFamily: 'TitilliumWeb-Bold',
        width: '100%',
    },
    // Empty result style close
});
 
export default Home;