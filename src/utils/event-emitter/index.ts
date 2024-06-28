// @ts-ignore fix: TypeError: undefined is not an object (evaluating '_$$_REQUIRE(_dependencyMap[0], "./react-native/Libraries/vendor/emitter/EventEmitter")
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import type {EventEmitter as EventEmitterType} from 'react-native';

type Constructor<T> = new (...args: any[]) => T;

export default EventEmitter as unknown as Constructor<EventEmitterType>;
