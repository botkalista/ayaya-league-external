#include <Windows.h>
#include <TlHelp32.h>
#include <node.h>

namespace Ayaya {

using v8::Boolean;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void isKeyPressed(const FunctionCallbackInfo<Value>& args) {
    int arg1 = args[0].As<Number>()->Value();
    bool res = GetAsyncKeyState(arg1) & 0x8000;
    args.GetReturnValue().Set(res);
}

void blockInput(const FunctionCallbackInfo<Value>& args) {
    bool arg1 = args[0].As<Boolean>()->Value();
    bool res = BlockInput(arg1);
    args.GetReturnValue().Set(res);
}

void setMousePos(const FunctionCallbackInfo<Value>& args) {
    int x = args[0].As<Number>()->Value();
    int y = args[1].As<Number>()->Value();
    bool res = SetCursorPos(x, y);
    args.GetReturnValue().Set(res);
}

int PressKey(int key) {
    INPUT input;
    input.type = INPUT_KEYBOARD;
    input.ki.wScan = key;
    input.ki.time = 0;
    input.ki.dwExtraInfo = 0;
    input.ki.wVk = 0;
    input.ki.dwFlags = KEYEVENTF_SCANCODE;
    return SendInput(1, &input, sizeof(INPUT));
}

int ReleaseKey(int key) {
    INPUT input;
    input.type = INPUT_KEYBOARD;
    input.ki.wScan = key;
    input.ki.time = 0;
    input.ki.dwExtraInfo = 0;
    input.ki.wVk = 0;
    input.ki.dwFlags = KEYEVENTF_SCANCODE | KEYEVENTF_KEYUP;
    return SendInput(1, &input, sizeof(INPUT));
}

void pressKey(const FunctionCallbackInfo<Value>& args) {
    int key = args[0].As<Number>()->Value();
    int res = PressKey(key);
    args.GetReturnValue().Set(res);
}
void releaseKey(const FunctionCallbackInfo<Value>& args) {
    int key = args[0].As<Number>()->Value();
    int res = ReleaseKey(key);
    args.GetReturnValue().Set(res);
}

void getMousePos(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    POINT pos;
    GetCursorPos(&pos);

    char _pos[10];
    sprintf(_pos, "%i_%i", pos.x, pos.y);

    args.GetReturnValue().Set(String::NewFromUtf8(isolate, _pos).ToLocalChecked());
}

void waitForClose(const FunctionCallbackInfo<Value>& args) {
    HANDLE arg1 = (HANDLE)(int)args[0].As<Number>()->Value();
    DWORD arg2 = args[1].As<Number>()->Value();
    DWORD ret = WaitForSingleObject(arg1, arg2);
    args.GetReturnValue().Set((int)ret);
}

void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "isKeyPressed", isKeyPressed);
    NODE_SET_METHOD(exports, "blockInput", blockInput);
    NODE_SET_METHOD(exports, "setMousePos", setMousePos);
    NODE_SET_METHOD(exports, "pressKey", pressKey);
    NODE_SET_METHOD(exports, "releaseKey", releaseKey);
    NODE_SET_METHOD(exports, "getMousePos", getMousePos);
    NODE_SET_METHOD(exports, "waitForClose", waitForClose);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace Ayaya