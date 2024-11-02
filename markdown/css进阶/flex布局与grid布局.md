# flex布局
## 设置
```css
display:flex;
```
## 基本属性
### 主轴对齐方式 justify-content
```css
center;
start;
end;
space-between;
space-around;
space-evenly;
```
###  侧轴对齐方式 aligh-items/aligh-content
同主轴对齐
###  单独的侧轴修改 aligh-self
###  主轴方向 flex-direction
```css
column;
row;
row-reverse;
column-reverse;
```
###  换行 f;ex-wrap
```css
wrap;
no-wrap;
```
###  flex分配空间
```css
flex:2;
//分走父级余下的份数
```
#  grid布局
##  容器
```css
grid-template-columns;
grid-template-rows;
```
##  值
px,em,rem,vh,vw仍可以用
###  fr
类似于
```css
flex:xx;
```
###  minmax(  ,  )
这是一个范围
###  fr&auto的比较
其他变化都能挤压auto，auto靠文本撑开
##  划分网格 grid-template-columns：repeat（列，宽）
###  auto-fill
按父级元素近可能多的划分
###  auto-fit
按子级元素是否有内容划分
### gap
```css
column-gap;
row-gap;
```
###  grid-auto-flow
类似于flex-direction,但没有reverse.
### dense
单独某几个网格补位

##  网格线定位
###  1
grid-column/row:start/end;
###  自定义网格线名
grid-template-columns:[xxx  xxx]xxpx;
tip:无法给repeat的网格线命名

##  区域
###  声明
```css
grid-template-areas：“A,A,A,C";
					 "A,A,A,C";
					 "C,C,C,C";
```
不需要的区域也要命名
###  使用
```css
grid area:A;
```
##  隐形网格
###  网格内


> Written with [StackEdit中文版](https://stackedit.cn/).
