import React, { Component } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextProps,
} from 'react-native'
import { IData } from './IData'
import { SuggesterEventEmitter } from './SuggesterEventEmitter'

interface Props {
  data: IData[]
  currentName?: string
  textWhenEmpty?: string
  backgroundColor?: string
  textColor?: string
  textFont?: string
  textFontSize?: number
  paddingHorizontal?: number
  paddingTop?: number
  selectFromList(name: string, value: string): void
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 7,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})

const SuggesterText = ({
  textColor,
  textFont,
  textFontSize,
  ...props
}: Pick<Props, 'textColor' | 'textFont' | 'textFontSize'> & TextProps) => (
  <Text
    style={[
      { color: textColor! },
      textFont ? { fontFamily: textFont } : {},
      textFontSize ? { fontSize: textFontSize } : {},
    ]}
    {...props}
  />
)

export class SuggesterModal extends Component<Props> {
  static defaultProps = {
    textWhenEmpty: 'Type text, we suggest',
    backgroundColor: 'white',
  }
  keyExtractor = (item: { id: string | number }) => `${item.id}`

  renderEmpty = () => {
    const { backgroundColor, textColor, textFont, textFontSize } = this.props
    return (
      <View style={[styles.empty, { backgroundColor }]}>
        <SuggesterText {...{ textColor, textFont, textFontSize }}>
          {this.props.textWhenEmpty}
        </SuggesterText>
      </View>
    )
  }

  handleSelect = ({
    selectFromList,
    name,
    value,
  }: {
    selectFromList: Props['selectFromList']
    name: string
    value: string
  }) => () => {
    selectFromList(name, value)
    SuggesterEventEmitter.emit(`selectFromList-${name}`, value)
  }

  renderItem = (selectFromList: Props['selectFromList']) => ({
    item,
  }: {
    item: IData
  }) => {
    const {
      backgroundColor,
      textColor,
      textFont,
      textFontSize,
      currentName,
      paddingHorizontal,
    } = this.props
    return (
      <TouchableOpacity
        onPress={this.handleSelect({
          selectFromList,
          name: currentName!,
          value: item.value,
        })}
        style={[styles.item, { backgroundColor, paddingHorizontal }]}
      >
        <SuggesterText {...{ textColor, textFont, textFontSize }}>
          {item.value}
        </SuggesterText>
      </TouchableOpacity>
    )
  }

  render() {
    const { data, selectFromList, paddingTop } = this.props
    return (
      <FlatList
        style={[StyleSheet.absoluteFill, paddingTop ? { paddingTop } : {}]}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem(selectFromList)}
        ListEmptyComponent={this.renderEmpty}
        keyboardShouldPersistTaps="always"
        data={data}
      />
    )
  }
}
