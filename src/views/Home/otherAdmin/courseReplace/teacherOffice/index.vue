<template>
	<div class="collapse">
		<a-table :columns="columns" :data-source="datas" :pagination="false" rowKey="id" bordered>
			<!-- slot中的name是指scopedSlots中customRender  slot-scope="text"的text就是数据源里的值赋值给text  -->
			<!-- 定义头部名称时 slot等于columns中的slots的title的值，然后赋值 -->
			<span slot="action" slot-scope="text, record, index">
				<a-button @click="handleClick(text, record, index)" type="primary">查看详情</a-button>
			</span>
		</a-table>
		<div>
			<a-modal :title="tanDatas.studio_name" :visible="visible" cancelType="primary" width="60%" @cancel="cancelClick" :centered="true">
				<div class="box">
					<div>工作室名称：{{ tanDatas.studio_name }}</div>
					<div>负责人：{{ tanDatas.teacher_name }}</div>
					<div>置换方案编号：{{ tanDatas.project_code }}</div>
					<div>
						申请理由：
						<p class="sj">{{ tanDatas.reason }}</p>
					</div>
					<a-button type="primary" class="downLoad" v-if="hasFile" @click="download(tanDatas.id)">下载附件</a-button>
				</div>
				<div slot="footer">
					<a-button @click="handleCancel" :loading="cancelLoading">不同意</a-button>
					<a-button @click="handleOk" type="primary" :loading="okLoading">同意</a-button>
				</div>

				<a-divider>课程置换名单</a-divider>
				<a-table :columns="columns2" :data-source="tableDatas" :confirm-loading="okLoading" :pagination="false" rowKey="student_id" bordered>
					<!-- slot中的name是指scopedSlots中customRender  slot-scope="text"的text就是数据源里的值赋值给text  -->
					<!-- 定义头部名称时 slot等于columns中的slots的title的值，然后赋值 -->
					<span slot="action" slot-scope="text, record, index">
						<a-button @click="handleClick(text, record, index)" type="primary">查看详情</a-button>
					</span>
				</a-table>

				<a-divider>受理单位</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>受理单位：{{ tanDatas.unit_title }}</div>
				<div>审核人：{{ tanDatas.unit_signer }}</div>
				<div>审核时间：{{ tanDatas.unit_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.unit_feedback_content }}</p>
				</div>
				<a-divider>教务处审核</a-divider>
				<div class="sub_input">
					<a-input type="text" placeholder="请输入审核人姓名" v-model="examine.signer" />
				</div>
				<a-textarea placeholder="请输入审核意见" v-model="examine.content" :rows="5" />
			</a-modal>
		</div>
	</div>
</template>

<script>
	const columns = [
		{
			title: "记录id",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "工作室名称",
			dataIndex: "studio_name",
			key: "studio_name",
		},
		{
			title: "负责人姓名",
			dataIndex: "teacher_name",
			key: "teacher_name",
		},
		{
			title: "申请时间",
			key: "apply_time",
			dataIndex: "apply_time",
		},
		{
			title: "操作",
			key: "action",
			scopedSlots: { customRender: "action" },
		},
	];
	const columns2 = [
		{
			title: "学生学号",
			dataIndex: "student_id",
			key: "student_id",
		},
		{
			title: "学生姓名",
			dataIndex: "student_name",
			key: "student_name",
		},
		{
			title: "课程名称",
			dataIndex: "course",
			key: "course",
		},
		{
			title: "成绩",
			dataIndex: "mark",
			key: "mark",
		},
		{
			title: "学生工作情况说明",
			dataIndex: "explain",
			key: "explain",
			width: 300,
		},
	];
	import { courseReplaceApplyGetTable, acadFeedBackCourseReplaceDatas, courseReplaceCheck, downloadCourseReplace } from "../../../../../network/api";
	export default {
		props: ["datas"],
		data() {
			return {
				columns,
				columns2,
				// 弹框
				visible: false,
				bianhao: false,
				// 弹框数据
				tanDatas: {},
				// loading
				cancelLoading: false,
				okLoading: false,
				// 弹框里表格的数据
				tableDatas: [],
				// 审核信息
				examine: {
					signer: "",
					content: "",
					project_code: "",
				},
				// 是否有附件
				hasFile: false,
			};
		},
		methods: {
			download(record_id) {
				window.open("/api/teacherstudio/download/course_replace?record_id=" + record_id);
			},
			handleClick(text, record, index) {
				courseReplaceCheck({ record_id: record.id }).then(res => {
					if (res.data.data.result) {
						this.hasFile = true;
					} else {
						this.hasFile = false;
					}
				});
				courseReplaceApplyGetTable({ record_id: record.id }).then(res => {
					this.tanDatas = res.data.data;
					const arr = [];
					for (const iterator of this.tanDatas.student) {
						arr.push(iterator);
					}
					this.tableDatas = arr;
					this.visible = true;
				});
			},
			// 同意
			handleOk(e) {
				if (this.examine.signer == "") {
					this.$message.warning("请填写审核人！");
					return;
				}
				this.sub_OK();
			},
			handleCancel(e) {
				if (this.examine.signer == "") {
					this.$message.warning("请填写审核人！");
					return;
				}
				this.cancelLoading = true;
				// record_id	整型	√	记录id
				// feedback	整型	√	意见，1同意，2拒绝
				// content	字符串		意见内容
				// signer	整型	√	审批人
				const obj = {
					record_id: this.tanDatas.id,
					feedback: 2,
					...this.examine,
				};
				acadFeedBackCourseReplaceDatas(obj).then(res => {
					this.$emit("againData");
					this.visible = false;
					this.cancelLoading = false;
					if (res.data.code == 1) {
						this.$message.success("操作成功！");
					} else {
						this.$message.error("未知错误！");
					}
					this.examine = {
						signer: "",
						content: "",
						project_code: "",
					};
				});
			},
			sub_OK() {
				this.okLoading = true;
				// record_id	整型	√	记录id
				// feedback	整型	√	意见，1同意，2拒绝
				// content	字符串		意见内容
				// signer	整型	√	审批人
				const obj = {
					record_id: this.tanDatas.id,
					feedback: 1,
					...this.examine,
				};
				acadFeedBackCourseReplaceDatas(obj).then(res => {
					this.$emit("againData");
					this.visible = false;
					this.okLoading = false;
					if (res.data.code == 1) {
						this.$message.success("操作成功！");
					} else {
						this.$message.error("未知错误！");
					}
					this.examine = {
						signer: "",
						content: "",
						project_code: "",
					};
				});
			},
			cancelClick() {
				// 关闭
				this.visible = false;
			},
		},
		created() {},
	};
</script>

<style lang="less" scoped>
	.content {
		.ant-collapse-content-box {
			background: red;
		}
	}
	.box {
		font-size: 16px;
		div {
			padding-top: 5px;
		}
		.downLoad {
			float: right;
			margin-right: 20px;
		}
	}
	.sub_input {
		width: 200px;
		margin-bottom: 20px;
	}
	.sj {
		text-indent: 2em;
	}
</style>
