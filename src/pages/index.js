import { Button, Input, Space, Table, Modal, Row, Col } from "antd"
import { useReducer, useState } from 'react';

const init = {
  obj: {
    text: '',
    type: false,
    typetext: '未完成',
  },
  list: [],
  key: 0,
  isModalOpen: false,
  insText: '',
  objkey: 0,
  checkboxList: []
}






function reducer(state, action) {
  switch (action.type) {
    case 'change_obj':
      return {
        ...state,
        obj: action.data
      }
    case 'change_list':
      return {
        ...state,
        list: action.data,
        key: state.key + 1,
        isModalOpen: false
      }
    case 'changed_isModalOpen':
      return {
        ...state,
        key: state.key + 1,
        isModalOpen: action.data,
        checkboxList:action.checkboxList,
      }
    case 'changed_insText':
      return {
        ...state,
        insText: action.data
      }
    case 'changed_objkey':
      return {
        ...state,
        objkey: state.objkey + 1
      }
    case 'changed_checkboxList':
      return {
        ...state,
        checkboxList: action.data
      }
    default:
      break;
  }
}



const Home = () => {
  const [state, dispatch] = useReducer(reducer, init)

  const col = [
    {
      title: '状态',
      dataIndex: 'typetext',
      key: 'typetext',
      filters: [
        {
          text: '完成',
          value: '完成',
        },
        {
          text: '未完成',
          value: '未完成',
        },
      ],
      onFilter: (value, record) => record.typetext.indexOf(value) === 0,
      sorter: (a, b) => a.typetext.length - b.typetext.length,
      sortDirections: ['descend'],
    },
    {
      title: '事项',
      dataIndex: 'text',
      key: 'text'
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space>
          <Button onClick={() => update(record)}>编辑</Button>
          <Button onClick={() => deletedata(record)}>删除</Button>
        </Space>
      )
    },
  ]


  function onChangeCreate(e) {
    dispatch({
      type: 'changed_insText', data: e.target.value
    })
  }

  function onChange(e) {
    dispatch({
      type: 'change_obj', data: {
        key: state.obj.key,
        text: e.target.value,
        type: state.obj.type,
        typetext: state.obj.typetext,
      }
    })
  }

  function create() {
    var newlist = state.list
    newlist.push({
      key: state.objkey,
      text: state.insText,
      type: false,
      typetext: '未完成',
    })
    dispatch({ type: 'change_list', data: newlist })
    dispatch({ type: 'changed_objkey' })
  }

  function update(value) {
    dispatch({ type: 'change_obj', data: value })
    dispatch({ type: 'changed_isModalOpen', data: true })
  }

  function deletedata(value) {
    var newlist = state.list
    newlist = newlist.filter(a => a !== value)
    console.log(newlist)
    dispatch({ type: 'change_list', data: newlist })
  }

  async function handleOk() {
    var newlist = state.list
    for (let index = 0; index < newlist.length; index++) {
      if (newlist[index].key == state.obj.key) {
        newlist[index] = state.obj
      }
    }
    dispatch({ type: 'change_list', data: newlist })
    dispatch({
      type: 'change_obj', data: {
        text: '',
        type: false,
        typetext: '未完成',
      }
    })
    dispatch({ type: 'changed_isModalOpen', data: false })
  };
  function handleCancel() {
    dispatch({ type: 'changed_isModalOpen', data: false })
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      var newlist = state.list
      for (let index = 0; index < newlist.length; index++) {
        newlist[index] = {
          key: newlist[index].key,
          text: newlist[index].text,
          type: false,
          typetext: '未完成',
        }
      }
      //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      for (let index = 0; index < selectedRowKeys.length; index++) {
        newlist[selectedRowKeys[index]] = {
          key: newlist[selectedRowKeys[index]].key,
          text: newlist[selectedRowKeys[index]].text,
          type: true,
          typetext: '完成',
        }
      }
      dispatch({ type: 'change_list', data: newlist, checkboxList: selectedRowKeys })
      dispatch({ type: 'changed_checkboxList', data: selectedRowKeys })
    }
  };

  return (
    <>
      <Input style={{ width: '300px' }} onChange={onChangeCreate}></Input><Button onClick={() => create()}>增加事项</Button>
      <Table
        key={state.key}
        columns={col}
        dataSource={state.list}
        rowKey={record => record.key}
        pagination={{
          position:['none','none']
        }}
        rowSelection={{
          type: 'checkbox',
          defaultSelectedRowKeys:state.checkboxList,
          hideSelectAll: true,
          ...rowSelection,
        }}
      ></Table>
      <Modal
        title='修改事项'
        open={state.isModalOpen}
        onOk={() => handleOk()}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消">
        <Row style={{ padding: '20px 50px' }}>
          <Col span={5} style={{ textAlign: 'center', lineHeight: "31.6px" }}><span>事项：</span></Col>
          <Col span={19}><Input value={state.obj.text} onChange={onChange} /></Col>
        </Row>
      </Modal>
    </>
  )
}
export default Home