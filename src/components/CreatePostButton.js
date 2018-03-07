import React from 'react';
import $ from 'jquery';
import { Modal, Button, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm';
import { API_ROOT, TOKEN_KEY, AUTH_PREFIX, POS_KEY, LOC_SHAKE } from '../constants';
import { PropTypes } from 'prop-types';

export class CreatePostButton extends React.Component {
    static propTypes = {
        loadNearbyPosts: PropTypes.func.isRequired,
    }

    state = {
        visible: false,
        confirmLoading: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        const form = this.form.getWrappedForm();
     
        form.validateFields((err, values) => {
            if (err) { return; }
            console.log('Received values of form: ', values);

            // prepare formData
            const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
            const formData = new FormData();
            formData.set('lat', lat + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE); // HTML5 uses wifi router, cell phone tower and other methods to pinpoint your location. 
            formData.set('lon', lon + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
            formData.set('message', form.getFieldValue('message'));
            formData.set('image', form.getFieldValue('image')[0]);

            // show loading on create button
            this.setState({ confirmLoading: true });
            // send request
            $.ajax({
                method: 'POST',
                url: `${API_ROOT}/post`,
                headers: {
                    Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                },
                processData: false,
                contentType: false,
                dataType: 'text',
                data: formData,
            }).then(() => {
                message.success('created a post successfully.');
                form.resetFields();
            },(error) => {
                message.error(error.responseText);
                form.resetFields();
            }).then(() => {
                this.props.loadNearbyPosts().then(() => {
                    this.setState({ visible: false, confirmLoading: false });
                });
            }).catch((e) => {
                message.error('create post failed.');
                console.error(e);
            });
        });
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Post</Button>
                <Modal title="Create New Post"
                       visible={visible}
                       onOk={this.handleOk}
                       okText="Create"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                       cancelText="Cancel"
                >
                    // From React ref :
                    // In rare cases, you might want to have access to a child’s DOM node from a parent component. 
                    // While you could add a ref to the child component, this is not an ideal solution, as you would only get a component instance rather than a DOM node. 
                    // Additionally, this wouldn’t work with functional components.
                    // Instead, in such cases we recommend exposing a special prop on the child. The child would take a function prop with an arbitrary name (e.g. inputRef) and attach it to the DOM node as a ref attribute. 
                    <WrappedCreatePostForm wrappedComponentRef={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}

