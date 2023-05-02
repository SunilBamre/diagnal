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
import HighlightText from '@sanar/react-native-highlight-text';

// Importing json data
import movieData1 from '../json/CONTENTLISTINGPAGE-PAGE1.json';
import movieData2 from '../json/CONTENTLISTINGPAGE-PAGE2.json';
import movieData3 from '../json/CONTENTLISTINGPAGE-PAGE3.json';

const windowWidth = Dimensions.get('window').width;
  
function Home() {

    // Initializing state values
    const [movies, setMovies] = useState([]);
    const [category, setCategory] = useState('');
    const [searchTxt, setSearchTxt] = useState('');
    const [highlight, setHighlight] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [loadCount, setLoadCount] = useState(1);

    let posterimage = require("../assets/images/poster6.jpg"); 

    {/* Fetching movies function open */} 
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
    {/* Fetching movies function close */}

    {/* Load more movies function open */}
    const loadMoreData = (index) => {
        let incrementer = loadCount + index.distanceFromEnd+1;
        if(incrementer <= 3){
            setLoadCount(incrementer);
        }
    }
    {/* Load more movies function close */}

    {/* Search movies function open */}
    const getSearchResult = (val : string) => {
        if(val.length !== 0){
            const searchkeyword = val.toLowerCase();
            const result = movies.filter((item) => {
                const title = item.name.toLowerCase();
                return title.includes(searchkeyword);
            })
            setSearchTxt(val);
            setMovies(result);
            const hilightKeywords = [];
            hilightKeywords.push(searchkeyword);
            setHighlight(hilightKeywords);
        }else{
            setSearchTxt('');
            setHighlight([]);
            getMovies();
        }
    }
    {/* Search movies function close */}

    {/* Handling back function open */}
    const backToSearch = () => {
        setVisibility(false);
        setSearchTxt(''); 
        setHighlight([]);
        getMovies(); 
    }
    {/* Handling back function close */}

    useEffect(() => {
        getMovies();
    },[loadCount]);

    return (
        <SafeAreaView style={styles.container}>
            <>
                {/* Navbar open */}
                <ImageBackground source={require('../assets/images/nav_bar.png')} resizeMode="cover" style={styles.navBar}>
                    {visibility ? 
                        <View style={styles.searchView}>
                            <TouchableOpacity onPress={backToSearch}>
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
                                maxLength={30}
                            />
                        </View>
                    :
                        <View style={styles.navBarView}>
                            <Text style={styles.navBarTitle} numberOfLines={1}>{category}</Text>
                            <TouchableOpacity onPress={()=> setVisibility(true)}>
                                <Image
                                    style={styles.searchIcon}
                                    source={require('../assets/images/search.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </ImageBackground>
                {/* Navbar close */}

                {/* Movies list open */}    
                <FlatList
                    contentContainerStyle={styles.flatlistContainer}
                    columnWrapperStyle={styles.flatlistWrapper}  
                    style={styles.flatlist}
                    data={movies}
                    renderItem={({item,index}) => (
                        <View style={styles.listItem}>
                            {/* 
                                Issue with dynamic image path in source attribute when fetching data from local json
                                <View style={styles.posterImgView}>
                                    <Image
                                        style={styles.posterImg}
                                        source={`require('../assets/images/${item['poster-image']}')`}
                                    /> 
                                </View>
                            */}
                            {posterimage !== null ? 
                                <View style={styles.posterImgView}>
                                    <Image
                                        style={styles.posterImg}
                                        source={posterimage}
                                    />
                                </View>
                            :
                                <View style={styles.posterImgView}>
                                    <Image
                                        style={styles.posterImg}
                                        source={require('../assets/images/placeholder_for_missing_posters.png')}
                                    />
                                </View>
                            }
                            <HighlightText
                                highlightStyle={{ backgroundColor: '#ffe300', color: 'black' }}
                                searchWords={highlight}
                                textToHighlight={item.name}
                                style={styles.movieName}
                                numberOfLines={1}
                            />
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
                {/* Movies list close */} 
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
        paddingRight:15,
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
        marginRight: 15,
    },
    inputBox: {
        width: '100%',
        borderWidth: 0,
        padding: 0,
        color: 'white',
        fontSize: 16,
        height: 25,
        flex: 1,
    },
    // Search box style close

    // Flatlist style open
    flatlistContainer: {
        // paddingHorizontal: 15,
        // marginLeft: -15,
    },
    flatlistWrapper: {
        justifyContent: 'space-between',
    },
    flatlist: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        // flex: 1,
    },
    listItem: {
        marginHorizontal: 10,
        marginBottom: 20,
        width: (windowWidth - 60) / 3,
    },
    posterImgView: {
        width: (windowWidth - 60) / 3,
        height: (windowWidth - 60) / 2,
    },
    posterImg:{
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
    movieName: {
        fontSize: 16,
        color: '#ffffff',
        // width: (windowWidth - 60) / 3,
        width: '100%',
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