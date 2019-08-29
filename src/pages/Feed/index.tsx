import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList} from 'react-native';
import LazyImage from '../../components/LazyImage';
import {
  Post,
  Header,
  Avatar,
  PostImage,
  Name,
  Description,
  Loading,
} from './styles';
export interface Author {
  name: string;
  avatar: string;
}
export interface Feed {
  id: number;
  image: string;
  small: string;
  aspectRatio: number;
  description: string;
  authorId: number;
  author: Author;
}
export default function Feed() {
  const [feed, setFeed] = useState<Feed[] | []>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewble, setViewble] = useState<any>([]);
  const loadPage = async (pageNumber: number = page, shouldRefresh = false) => {
    if (total && pageNumber > total) return;
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`,
    );
    const totalItems: any = response.headers.get('X-Total-Count');
    setTotal(Math.floor(totalItems / 5));
    const data = await response.json();
    setFeed(shouldRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  };
  useEffect(() => {
    loadPage();
  }, []);

  const refreshList = async () => {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  };
  const handleViewbleChanged = (changed: any) => {
    setViewble(changed.map(({item}: any) => item.id));
  };
  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={(post: any) => String(post.id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListFooterComponent={loading && <Loading />}
        //onViewableItemsChanged={handleViewbleChanged}
        renderItem={({item}: {item: Feed}) => (
          <Post>
            <Header>
              <Avatar source={{uri: item.author.avatar}}></Avatar>
              <Name>{item.author.name}</Name>
            </Header>
            <LazyImage
              shoudLoad={viewble.includes(item.id)}
              smallSource={{uri: item.small}}
              aspectRatio={item.aspectRatio}
              source={{uri: item.image}}
            />
            <Description>
              <Name>{item.author.name}</Name> {item.description}
            </Description>
          </Post>
        )}></FlatList>
    </View>
  );
}
