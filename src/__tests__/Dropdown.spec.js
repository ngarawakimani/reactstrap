import React from 'react';
import { mount } from 'enzyme';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '../';
import { keyCodes } from '../utils';


describe('Dropdown', () => {
  let isOpen;
  let toggle;
  let element;

  beforeEach(() => {
    isOpen = false;
    toggle = () => { isOpen = !isOpen; };
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (jest.isMockFunction(Dropdown.prototype.componentDidUpdate)) Dropdown.prototype.componentDidUpdate.mockRestore();
    if (jest.isMockFunction(Dropdown.prototype.handleProps)) Dropdown.prototype.handleProps.mockRestore();
    if (jest.isMockFunction(Dropdown.prototype.toggle)) Dropdown.prototype.toggle.mockRestore();
    if (jest.isMockFunction(Dropdown.prototype.handleDocumentClick)) Dropdown.prototype.handleDocumentClick.mockRestore();
    document.body.removeChild(element);
    element = null;
  });

  it('should render a single child', () => {
    const wrapper = mount(<Dropdown isOpen={isOpen} toggle={toggle}>Ello world</Dropdown>);

    expect(wrapper.text()).toBe('Ello world');
    expect(wrapper.find('.dropdown').length).toBe(1);
  });

  it('should render multiple children when isOpen is true', () => {
    isOpen = true;
    const wrapper = mount(
      <Dropdown isOpen={isOpen} toggle={toggle}>
        <DropdownToggle>Toggle</DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Test</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );

    expect(wrapper.find('.btn').text()).toBe('Toggle');
    expect(wrapper.find('.dropdown').length).toBe(1);
    expect(wrapper.find('.dropdown-item').length).toBe(1);
    expect(wrapper.children().length).toBe(2);
  });

  it('should not call props.toggle when disabled ', () => {
    isOpen = true;
    let props = createSpyObj('props', ['toggle']);
    const wrapper = mount(
      <Dropdown isOpen={isOpen} toggle={props.toggle} disabled>
        <DropdownToggle>Toggle</DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Test</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    const instance = wrapper.instance();

    instance.toggle({ preventDefault: () => { } });
    expect(props.toggle).not.toHaveBeenCalled();
  });

  describe('handleProps', () => {
    it('should be called on componentDidUpdate when isOpen changed', () => {
      jest.spyOn(Dropdown.prototype, 'componentDidUpdate');
      jest.spyOn(Dropdown.prototype, 'handleProps');
      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );

      const instance = wrapper.instance();

      expect(Dropdown.prototype.componentDidUpdate.mock.calls.length).toBe(0);
      expect(Dropdown.prototype.handleProps.mock.calls.length).toBe(1);
      expect(instance.props.isOpen).toBe(false);

      isOpen = true;
      wrapper.setProps({ isOpen: isOpen });

      expect(Dropdown.prototype.componentDidUpdate.mock.calls.length).toBe(1);
      expect(Dropdown.prototype.handleProps.mock.calls.length).toBe(2);
      expect(instance.props.isOpen).toBe(true);
    });

    it('should not be called on componentDidUpdate when isOpen did not change', () => {
      jest.spyOn(Dropdown.prototype, 'componentDidUpdate');
      jest.spyOn(Dropdown.prototype, 'handleProps');
      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      const instance = wrapper.instance();

      expect(Dropdown.prototype.componentDidUpdate.mock.calls.length).toBe(0);
      expect(Dropdown.prototype.handleProps.mock.calls.length).toBe(1);
      expect(instance.props.isOpen).toBe(false);

      wrapper.setProps({ 'data-foo': 'bar' });

      expect(Dropdown.prototype.componentDidUpdate.mock.calls.length).toBe(1);
      expect(Dropdown.prototype.handleProps.mock.calls.length).toBe(1);
      expect(instance.props.isOpen).toBe(false);
    });
  });

  describe('removeEvents', () => {
    it('should be called on componentWillUnmount', () => {
      jest.spyOn(Dropdown.prototype, 'componentWillUnmount');
      jest.spyOn(Dropdown.prototype, 'removeEvents');
      isOpen = true;
      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );

      expect(Dropdown.prototype.componentWillUnmount.mock.calls.length).toBe(0);
      expect(Dropdown.prototype.removeEvents.mock.calls.length).toBe(0);

      wrapper.unmount();

      expect(Dropdown.prototype.componentWillUnmount.mock.calls.length).toBe(1);
      expect(Dropdown.prototype.removeEvents.mock.calls.length).toBe(1);
    });
  });

  describe('handleDocumentClick', () => {
    it('should call toggle on document click', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'handleDocumentClick');
      jest.spyOn(Dropdown.prototype, 'toggle');

      mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );

      expect(Dropdown.prototype.handleDocumentClick.mock.calls.length).toBe(0);
      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      document.body.click();

      expect(Dropdown.prototype.handleDocumentClick.mock.calls.length).toBe(1);
      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(1);
    });

    it('should call toggle on container click', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'handleDocumentClick');
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown id="test" isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.handleDocumentClick.mock.calls.length).toBe(0);
      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      document.getElementById('test').click();

      expect(Dropdown.prototype.handleDocumentClick.mock.calls.length).toBe(1);
      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should not call toggle on inner container click', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'handleDocumentClick');
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.handleDocumentClick.mock.calls.length).toBe(0);
      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      document.getElementById('divider').click();

      expect(Dropdown.prototype.handleDocumentClick.mock.calls.length).toBe(1);
      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should not call toggle when right-clicked', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.instance().handleDocumentClick({ type: 'click', which: 3 });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      wrapper.detach();
    });

    it('should call toggle when key is tab', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.instance().handleDocumentClick({ type: 'keyup', which: keyCodes.tab });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(1);
      wrapper.detach();
    });
  });

  describe('keyboard events', () => {
    it('should call toggle on ESC keydown when it isOpen is true', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.simulate('keydown', { which: keyCodes.esc });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should call toggle on ESC keydown when it isOpen is true', () => {
      isOpen = false;
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.simulate('keydown', { which: keyCodes.esc });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should call toggle on down arrow keydown when it isOpen is false', () => {
      isOpen = false;
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.simulate('keydown', { which: keyCodes.down });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should call toggle on up arrow keydown when it isOpen is false', () => {
      isOpen = false;
      jest.spyOn(Dropdown.prototype, 'toggle');

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.simulate('keydown', { which: keyCodes.up });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should focus the first menu item on up arrow keydown when it isOpen is true', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const focus = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onFocus={focus}>Test</DropdownItem>
            <DropdownItem id="divider" divider />
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.simulate('keydown', { which: keyCodes.up });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(focus.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should focus the first menu item on down arrow keydown when it isOpen is true', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const focus1 = jest.fn();
      const focus2 = jest.fn();
      const focus3 = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onFocus={focus1}>Test</DropdownItem>
            <DropdownItem onFocus={focus2}>Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem onFocus={focus3}>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.simulate('keydown', { which: keyCodes.down });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(focus1.mock.calls.length).toBe(1);
      expect(focus2.mock.calls.length).toBe(0);
      expect(focus3.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should focus the next menu item on down arrow keydown when it isOpen is true and anther item is focused', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const focus1 = jest.fn();
      const focus2 = jest.fn();
      const focus3 = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem id="first" onFocus={focus1}>Test</DropdownItem>
            <DropdownItem onFocus={focus2}>Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem onFocus={focus3}>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#first').simulate('keydown', { which: keyCodes.down });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(focus1.mock.calls.length).toBe(0);
      expect(focus2.mock.calls.length).toBe(1);
      expect(focus3.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should skip non-menu items focus the next menu item on down arrow keydown when it isOpen is true and anther item is focused', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const focus1 = jest.fn();
      const focus2 = jest.fn();
      const focus3 = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem id="first" onFocus={focus1}>Test</DropdownItem>
            <DropdownItem id="second" onFocus={focus2}>Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem onFocus={focus3}>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#second').simulate('keydown', { which: keyCodes.down });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(focus1.mock.calls.length).toBe(0);
      expect(focus2.mock.calls.length).toBe(0);
      expect(focus3.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should focus the previous menu item on up arrow keydown when it isOpen is true and anther item is focused', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const focus1 = jest.fn();
      const focus2 = jest.fn();
      const focus3 = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem id="first" onFocus={focus1}>Test</DropdownItem>
            <DropdownItem id="second" onFocus={focus2}>Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem onFocus={focus3}>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#second').simulate('keydown', { which: keyCodes.up });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(focus1.mock.calls.length).toBe(1);
      expect(focus2.mock.calls.length).toBe(0);
      expect(focus3.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should not wrap focus with down arrow keydown', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const focus1 = jest.fn();
      const focus2 = jest.fn();
      const focus3 = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem id="first" onFocus={focus1}>Test</DropdownItem>
            <DropdownItem id="second" onFocus={focus2}>Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem id="third" onFocus={focus3}>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#third').simulate('keydown', { which: keyCodes.down });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(focus1.mock.calls.length).toBe(0);
      expect(focus2.mock.calls.length).toBe(0);
      expect(focus3.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should not wrap focus with up arrow keydown', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const focus1 = jest.fn();
      const focus2 = jest.fn();
      const focus3 = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem id="first" onFocus={focus1}>Test</DropdownItem>
            <DropdownItem id="second" onFocus={focus2}>Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem id="third" onFocus={focus3}>Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#first').simulate('keydown', { which: keyCodes.up });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(focus1.mock.calls.length).toBe(1);
      expect(focus2.mock.calls.length).toBe(0);
      expect(focus3.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should trigger a click on links when an item is focused and space[bar] it pressed', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const click = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem href="#" id="first" onClick={click}>Test</DropdownItem>
            <DropdownItem id="second">Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem id="third">Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#first').simulate('keydown', { which: keyCodes.space });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(click.mock.calls.length).toBe(1);

      wrapper.detach();
    });

    it('should not trigger a click on buttons when an item is focused and space[bar] it pressed (browser does this)', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const click = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem id="first" onClick={click}>Test</DropdownItem>
            <DropdownItem id="second">Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem id="third">Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#first').simulate('keydown', { which: keyCodes.space });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(click.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should not trigger anything when within an input', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const click = jest.fn();
      const focus = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag="div" id="first" onClick={click} onFocus={focus}><input id="input" /></DropdownItem>
            <DropdownItem id="second">Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem id="third">Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#input').simulate('keydown', { which: keyCodes.up });
      wrapper.find('#input').simulate('keydown', { which: keyCodes.down });
      wrapper.find('#input').simulate('keydown', { which: keyCodes.space });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(click.mock.calls.length).toBe(0);
      expect(focus.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should not trigger anything when within a textarea', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const click = jest.fn();
      const focus = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag="div" id="first" onClick={click} onFocus={focus}><textarea id="input" /></DropdownItem>
            <DropdownItem id="second">Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem id="third">Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#input').simulate('keydown', { which: keyCodes.up });
      wrapper.find('#input').simulate('keydown', { which: keyCodes.down });
      wrapper.find('#input').simulate('keydown', { which: keyCodes.space });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(click.mock.calls.length).toBe(0);
      expect(focus.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should not trigger anything when disabled', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const click = jest.fn();
      const focus = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle} disabled>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag="div" id="first" onClick={click} onFocus={focus}>Test</DropdownItem>
            <DropdownItem id="second">Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem id="third">Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#first').simulate('keydown', { which: keyCodes.up });
      wrapper.find('#first').simulate('keydown', { which: keyCodes.down });
      wrapper.find('#first').simulate('keydown', { which: keyCodes.space });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(click.mock.calls.length).toBe(0);
      expect(focus.mock.calls.length).toBe(0);

      wrapper.detach();
    });

    it('should not focus anything when all items disabled', () => {
      isOpen = true;
      jest.spyOn(Dropdown.prototype, 'toggle');
      const click = jest.fn();
      const focus = jest.fn();

      const wrapper = mount(
        <Dropdown isOpen={isOpen} toggle={toggle}>
          <DropdownToggle>Toggle</DropdownToggle>
          <DropdownMenu right>
            <DropdownItem disabled tag="div" id="first" onClick={click} onFocus={focus}>Test</DropdownItem>
            <DropdownItem disabled id="second">Test</DropdownItem>
            <DropdownItem id="divider" divider />
            <DropdownItem disabled id="third">Test</DropdownItem>
          </DropdownMenu>
        </Dropdown>, { attachTo: element });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);

      wrapper.find('#first').simulate('keydown', { which: keyCodes.up });
      wrapper.find('#first').simulate('keydown', { which: keyCodes.down });
      wrapper.find('#first').simulate('keydown', { which: keyCodes.space });

      expect(Dropdown.prototype.toggle.mock.calls.length).toBe(0);
      expect(click.mock.calls.length).toBe(0);
      expect(focus.mock.calls.length).toBe(0);

      wrapper.detach();
    });
  });

  it('should render different size classes', () => {
    const small = mount(
      <Dropdown group isOpen={isOpen} size="sm" toggle={toggle}>
        <DropdownToggle>Toggle</DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Test</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );

    const large = mount(
      <Dropdown group isOpen={isOpen} size="lg" toggle={toggle}>
        <DropdownToggle>Toggle</DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Test</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );

    expect(small.find('.btn-group-sm').length).toBe(1);
    expect(large.find('.btn-group-lg').length).toBe(1);
  });
});
