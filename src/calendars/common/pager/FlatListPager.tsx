import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {getIndexByOffset} from './get-index-by-offset';
import {debounce} from 'debounce';
import Animated, {
  SharedValue,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
} from 'react-native-reanimated';
import {ScrollView as GNScrollView} from 'react-native-gesture-handler';
import {
  useArgByRef,
  useInit,
  useIsFirstRender,
  useStableCallback,
} from '@rozhkov/react-useful-hooks';
import {useSetRefs} from '@utils/react-hooks';

const MemoAnimatedFlatList = memo(
  Animated.FlatList,
) as unknown as typeof Animated.FlatList;

const renderScrollComponent = (props: any) => <GNScrollView {...props} />;

export type SyncIndexConfig = {
  enable: boolean;
  animated: boolean;
  delay: number;
};

const defaultSyncIndexConfig: SyncIndexConfig = {
  enable: true,
  animated: true,
  delay: 200,
};

export type FlatListPagerMethods = Pick<FlatList, 'scrollToIndex'>;
export type RenderPage<ItemT> = (
  info: ListRenderItemInfo<ItemT>,
) => React.ReactElement | null;

export type FlatListPagerProps<ItemT = any> = {
  data: ReadonlyArray<ItemT>;
  index: number;
  syncIndexIfChanged?: Partial<SyncIndexConfig>;
  keyExtractor: (item: ItemT, index: number) => string;
  renderPage: RenderPage<ItemT>;
  onChangeIndex?: (index: number) => void;
  indexProgressSv?: SharedValue<number>;
  pageLength: number;
  horizontal?: boolean;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  windowSize?: number;
} & Pick<FlatListProps<ItemT>, 'pointerEvents'>;

const FlatListPager = <ItemT,>(
  {
    data,
    index,
    onChangeIndex,
    syncIndexIfChanged: syncIndexIfChangedProp,
    pageLength,
    horizontal,
    renderPage,
    keyExtractor,
    indexProgressSv,
    style,
    contentContainerStyle,
    pointerEvents,
    windowSize = 3,
  }: FlatListPagerProps<ItemT>,
  forwardedRef: ForwardedRef<FlatList<ItemT>>,
) => {
  const {
    enable: syncIndexEnable,
    animated: syncIndexAnimated,
    delay: syncIndexDelay,
  } = {...defaultSyncIndexConfig, ...(syncIndexIfChangedProp ?? {})};

  const initialIndex = useInit(() => index);
  const ref = useAnimatedRef<FlatList>();
  const setRefs = useSetRefs(forwardedRef, ref);
  const pageLengthRef = useArgByRef(pageLength);
  const dataRef = useArgByRef(data);
  const indexRef = useArgByRef(index);
  const syncIndexAnimatedRef = useArgByRef(syncIndexAnimated);

  const scrollOffsetSv = useScrollViewOffset(ref as any);
  useDerivedValue(() => {
    if (indexProgressSv !== undefined) {
      indexProgressSv.value = scrollOffsetSv.value / pageLength;
    }
  });

  const offsetRef = useRef(0);
  const getCurIndex = useCallback(() => {
    return getIndexByOffset(offsetRef.current, {
      indexMax: dataRef.current.length,
      length: pageLengthRef.current,
    });
  }, [dataRef, pageLengthRef]);

  const syncIndex = useMemo(() => {
    return debounce(
      () => {
        const curIndex = getCurIndex();
        const indexProp = indexRef.current;
        const dataLength = dataRef.current.length;
        const animated = syncIndexAnimatedRef.current;
        if (
          indexProp !== curIndex &&
          indexProp >= 0 &&
          indexProp < dataLength
        ) {
          ref.current?.scrollToIndex({
            index: indexProp,
            animated,
          });
        }
      },
      syncIndexDelay,
      false,
    );
  }, [
    dataRef,
    getCurIndex,
    indexRef,
    ref,
    syncIndexAnimatedRef,
    syncIndexDelay,
  ]);

  const changeIndex = useStableCallback((i: number) => {
    onChangeIndex?.(i);
    syncIndex();
  });

  const offsetField = horizontal ? 'x' : 'y';

  const onScroll = useCallback(
    ({
      nativeEvent: {contentOffset},
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      offsetRef.current = contentOffset[offsetField];
      const calcIndex = getCurIndex();
      if (indexRef.current !== calcIndex) {
        changeIndex(calcIndex);
      }
    },
    [changeIndex, getCurIndex, indexRef, offsetField],
  );

  const getItemLayout = useCallback<
    (
      data: Array<ItemT> | null | undefined,
      index: number,
    ) => {length: number; offset: number; index: number}
  >(
    (_, i) => {
      return {
        index: i,
        offset: pageLength * i,
        length: pageLength,
      };
    },
    [pageLength],
  );

  const isFirstRender = useIsFirstRender();

  // Sync FlatListPager when changed index
  useEffect(() => {
    if (!syncIndexEnable || isFirstRender) {
      return;
    }
    syncIndex();
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync FlatListPager when changed pageLength
  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    if (index >= 0) {
      ref.current?.scrollToIndex({
        index,
        animated: false,
      });
    }
  }, [pageLength]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MemoAnimatedFlatList
      ref={setRefs as any}
      style={style}
      pointerEvents={pointerEvents}
      pagingEnabled={true}
      onScroll={onScroll}
      getItemLayout={getItemLayout}
      scrollEventThrottle={16}
      data={data}
      horizontal={horizontal}
      initialScrollIndex={initialIndex}
      renderScrollComponent={renderScrollComponent}
      renderItem={renderPage}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
      windowSize={windowSize}
      maxToRenderPerBatch={3}
      initialNumToRender={1}
      updateCellsBatchingPeriod={1}
    />
  );
};

type ResultComponentType = <ItemT>(
  p: FlatListPagerProps<ItemT> & React.RefAttributes<FlatList<ItemT>>,
) => React.ReactElement;

export default memo(forwardRef(FlatListPager)) as ResultComponentType;
